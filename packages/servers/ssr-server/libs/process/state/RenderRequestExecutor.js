class RenderRequestExecutor {
  constructor(environments) {
    this.environments = environments;
  }

  async render(handler, markup) {
    const connections = await this.environments.getConnections(handler.id);

    if (!connections) {
      throw new Error(`No render environments exist for handler "${handler.id}".`);
    }

    const environment = await handler.balancer.select(connections);

    return await environment.render(markup);
  }

  async doRender(environment, handler, input) {
  }
}

module.exports = {
  RenderRequestExecutor,
};
