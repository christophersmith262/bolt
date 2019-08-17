class EnvironmentConnectionBalancer {
  async select(environments) {
    const keys = Object.keys(environments);

    if (!keys.length) {
      throw new Error("No environment available.");
    }

    const key = await this.getKey(keys);

    if (!(key in environments)) {
      throw new Error(`Invalid environment selected "${key}".`);
    }

    return environments[key];
  }

  async getKey(environments, keys) {
  }
}

module.exports = {
  EnvironmentConnectionBalancer,
};
