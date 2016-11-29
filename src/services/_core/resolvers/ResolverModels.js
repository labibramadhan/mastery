import _ from 'lodash';

export default class ResolverModels {
  constructor() {
    this.databases = server.plugins['hapi-sequelize'];
  }

  getModelConfs = qualifier => _.pickBy(conf.get('models'), qualifier)

  getModel = (modelName) => {
    const database = conf.get(`models:${modelName}:database`);
    return this.databases[database].models[modelName];
  }

  getModels = (modelNames) => {
    const self = this;
    const modelNamesArray = _.castArray(modelNames);
    let modelsFound = {};
    _.each(modelNamesArray, (modelName) => {
      const database = conf.get(`models:${modelName}:database`);
      const modelInstance = self.databases[database].models[modelName];
      modelsFound = {
        [modelName]: modelInstance,
        ...modelsFound,
      };
    });
    return modelsFound;
  }

  getAllModels = () => {
    const self = this;
    const databaseIndentifiers = _.keys(conf.get('databases'));
    let allModels = {};
    _.each(databaseIndentifiers, (databaseIndentifier) => {
      const modelNames = _.keys(self.getModelConfs({ database: databaseIndentifier }));
      const models = self.getModels(modelNames);
      allModels = {
        ...allModels,
        ...models,
      };
    });
    return allModels;
  }
}
