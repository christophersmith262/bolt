const { Filter } = require('./Filter');

class EachFilter extends Filter {
  constructor(filters) {
    super();

    if (typeof filters !== 'object' || filters.constructor.name.toLowerCase() != 'array') {
      filters = [filters];
    }

    this.filters = filters;
  }

  async apply(environment, route, type, input) {
    if (typeof input !== 'object') {
      throw new Error('each() applied to a non object / array!');
    }

    const promises = [];
    for (let i in input) {
      promises.push(new Promise(async accept => {
        for (let j in this.filters) {
          input[i] = await this.filters[j].apply(environment, route, input[i]);
        }
        accept();
      }));
    }

    await Promise.all(promises);

    return input;
  }
}

module.exports = (filters) => {
  return new EachFilter(filters);
}
