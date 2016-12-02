import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import * as HapiSequelize from 'hapi-sequelize';

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

export default class BootDatabases {
  constructor() {
    this.resolverModels = new ResolverModels();
  }

  boot = async () => {
    const self = this;
    const databases = conf.get('databases');
    const sequelizeCollection = {};
    const options = _.map(databases, (database, name) => {
      const {
        db,
        username,
        password,
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
      sequelizeCollection[name] = sequelize;
      const models = self.resolverModels.getModelConfs({ database: name });
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
        sync: false,
        forceSync: false,
        debug,
      };
    });

    await server.register({
      register: HapiSequelize,
      options,
    });
  }
}
