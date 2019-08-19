class RenderRequestExecutor {
  constructor(environments, connections) {
    this.environments = environments;
    this.connections = connections;
  }

  async execute(route, type, input) {
    const handler = await this._getHandler(route, type);
    if (!handler) {
      throw new Error(`Unsupported input type "${type}".`);
    }

    const connections = await this.connections.getConnections(handler.environment);

    if (!connections) {
      throw new Error(`No render environments exist for handler "${route.id}[${handler.id}]".`);
    }

    const balancer = this.environments[handler.environment].balancer,
      environment = await balancer.select(connections);

    if (!environment) {
      throw new Error(`The environment balancer failed to select an environment for "${route.id}[${handler.id}]".`);
    }

    let result = await handler.format.decode(input);
    for (let i in handler.filters) {
      result = await handler.filters[i].apply(environment, route, type, result);
    }

    return handler.format.encode(result);
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

module.exports = {
  RenderRequestExecutor,
};
