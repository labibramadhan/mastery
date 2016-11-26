import _ from 'lodash';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import Sequelize from 'sequelize';
import * as HapiSequelize from 'hapi-sequelize';

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

export const getAllModels = () => {
  const databaseIndentifiers = _.keys(conf.get('databases'));
  let allModels = {};
  _.each(databaseIndentifiers, (databaseIndentifier) => {
    const modelNames = _.keys(getModelConfsByIdentifier(databaseIndentifier));
    const models = getModels(modelNames);
    allModels = {
      ...allModels,
      ...models,
    };
  });
  return allModels;
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

const bootDatabases = async () => {
  const databases = conf.get('databases');
  const options = _.map(databases, (database, name) => {
    const {
      db,
      username,
      password,
      sync,
      forceSync,
      debug,
    } = database;

    const dbConfig = _.omit(database, [
      'db',
      'username',
      'password',
      'sync',
      'forceSync',
      'debug',
    ]);

    const sequelize = new Sequelize(db, username || '', password || '', dbConfig);
    const models = getModelConfsByIdentifier(name);
    const resolvedModels = _.map(models, (modelConf, modelName) => {
      let modelPath;
      if (_.has(modelConf, 'location')) {
        modelPath = path.resolve(path.join(rootPath, modelConf.location));
        if (!fs.existsSync(modelPath)) {
          throw new Error(`${modelName} model cannot be found`);
        }
      } else {
        const expectedModelName = `${modelName}Model.js`;
        modelPath = path.join(rootPath, 'component', '**', expectedModelName);
      }
      return modelPath;
    });
    return {
      name,
      models: resolvedModels,
      sequelize,
      sync,
      forceSync,
      debug,
    };
  });

  await server.register({
    register: HapiSequelize,
    options,
  });
};

const bootPlugins = async () => {
  // retrieve all available package plugins
  const pluginGlob = path.resolve(path.join(rootPath, 'plugins', '**', '*.js'));
  const plugins = glob.sync(pluginGlob);
  for (const plugin of plugins) { // eslint-disable-line no-restricted-syntax
    await server.register(require(plugin));
  }
};

const bootRoutes = async () => {
  const routesSetup = requireF('setup/_core/routes');
  // retrieve all available routes, pass the models from sequelize as a single parameter
  const allModels = getAllModels();
  const allRoutes = await routesSetup(allModels);
  server.route(allRoutes);
};

const bootScripts = async (hook) => {
  const bootGlob = path.resolve(path.join(rootPath, 'setup', 'boot', '**', `*${hook}.js`));

  // retrieve all available boot scripts
  const bootFiles = glob.sync(bootGlob);
  for (const bootFile of bootFiles) { // eslint-disable-line no-restricted-syntax
    // execute the boot script
    const bootScript = require(bootFile);
    await bootScript();
  }
};

export const bootServer = async () => {
  // boot databases defined in config/*.json with "databases" keys
  await bootDatabases();

  // boot local plugins from /plugins/**/*.js
  await bootPlugins();

  // boot all boot script from /setup/boot/**/*Before.js
  await bootScripts('Before');

  // boot all routes from /component/**/*Routes.js
  await bootRoutes();

  // boot all boot scripts from /setup/boot/**/*After.js
  await bootScripts('After');
};
