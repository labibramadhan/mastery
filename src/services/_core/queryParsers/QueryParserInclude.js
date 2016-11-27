import _ from 'lodash';

export default class QueryParserInclude {
  constructor(models) {
    this.models = models;
  }

  parse = async (query) => {
    const {
      getIncludeModelInstances,
      models,
    } = this;

    if (typeof query.include === 'undefined') return [];

    const includes = _.castArray(query.include);

    const resolvedIncludes = includes.map(async includeItem =>
      getIncludeModelInstances(includeItem, models)).filter(_.identity);

    return await Promise.all(resolvedIncludes);
  }

  getIncludeModelInstances = function getIncludeModelInstances(includeItem, models) {
    return new Promise(async (resolve) => {
      const include = _.clone(includeItem);
      if (include) {
        if (typeof include === 'string' && typeof models[include] !== 'undefined') {
          return resolve(models[include]);
        } else if (typeof include === 'object') {
          if (
            typeof include.model === 'string' &&
            include.model.length &&
            typeof models[include.model] !== 'undefined'
          ) {
            include.model = models[include.model];
          }
          if (typeof include.include !== 'undefined') {
            include.include = await getIncludeModelInstances(include.include, models);
            return resolve(include);
          }
        }
      }
      return resolve(include);
    });
  }
}
