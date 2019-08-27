class MissingRouteError extends Error {}
class MissingHandlerError extends Error {}
class NoEnvironmentsError extends Error {}

class RenderRequestRouter {
  constructor() {
    this.routes = {};
    this.environments = {};
    this.connections = null;
  }

  setEnvironments(environments) {
    this.environments = environments;
    return this;
  }

  setConnections(connections) {
    this.connections = connections;
    return this;
  }

  setRoutes(routes) {
    this.routes = routes;
    return this;
  }

  async execute(routeId, type, input) {
    const route = this.routes[routeId];
    if (!route) {
      throw new MissingRouteError(`Route does not exist "${routeId}".`);
    }

    const handler = await this._getHandler(route, type);
    if (!handler) {
      throw new MissingHandlerError(`Unsupported input type "${type}".`);
    }

    const connections = await this.connections.getConnections(handler.environment);
    if (!connections) {
      throw new NoEnvironmentsError(`No render environments exist for handler "${routeId}[${handler.id}]".`);
    }

    const balancer = this.environments[handler.environment].balancer,
      environment = await balancer.select(connections);

    if (!environment) {
      throw new Error(`The environment balancer failed to select an environment for "${routeId}[${handler.id}]".`);
    }

    let result = await handler.format.decode(input);
    for (let i in handler.filters) {
      result = await handler.filters[i].apply(environment, route, type, result);
    }
    result = await handler.format.encode(result);

    /*if (result.timeout) {
      throw new Error('Render operation timed out!');
    }*/

    return result;
  }

  async _getHandler(route, type) {
    for (let i in route.handlers) {
      const handler = route.handlers[i];
      if (handler.types.has(type) || !handler.types.size) {
        return handler;
      }
    }
  }
}

module.exports = () => {
  return new RenderRequestRouter();
};

module.exports.RenderRequestRouter = RenderRequestRouter;
