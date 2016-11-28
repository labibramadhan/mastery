import _ from 'lodash';
import path from 'path';

export const requireF = file => require(path.join(rootPath, file));

export const getPackage = () => {
  const rootPath = path.resolve(path.join(__dirname, '..', '..', '..'));

  // return the contents of /package.json
  return require(path.join(rootPath, 'package.json'));
};

export const concatToJoiObject = (joiObject, candidate) => {
  if (!candidate) return joiObject;
  else if (candidate.isJoi) return joiObject.concat(candidate);
  return joiObject.keys(candidate);
};

export const getModelConfsByIdentifier = identifier => _.pickBy(conf.get('models'), {
  database: identifier,
});

export const getModel = (modelName) => {
  const databases = server.plugins['hapi-sequelize'];
  const database = conf.get(`models:${modelName}:database`);
  return databases[database].models[modelName];
};

export const getModels = (modelNames) => {
  const databases = server.plugins['hapi-sequelize'];
  const modelNamesArray = _.castArray(modelNames);
  let modelsFound = {};
  _.each(modelNamesArray, (modelName) => {
    const database = conf.get(`models:${modelName}:database`);
    const modelInstance = databases[database].models[modelName];
    modelsFound = {
      [modelName]: modelInstance,
      ...modelsFound,
    };
  });
  return modelsFound;
};

export const associateModel = (models, modelName) => {
  const associations = conf.get(`models:${modelName}:relationships`);
  _.each(associations, (association) => {
    const {
      type,
      model,
    } = association;
    const associationConfig = _.omit(association, ['type', 'model']);
    if (_.has(associationConfig, 'through')) {
      associationConfig.through = models[associationConfig.through];
    }
    models[modelName][type](models[model], associationConfig);
  });
};
