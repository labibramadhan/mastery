import Sequelize from 'sequelize';
import _ from 'lodash';
import assert from 'assert';
import fs from 'fs';
import path from 'path';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

export default class DatabaseBoot {
  constructor() {
    this.modelResolver = new ModelResolver();
  }

  normalizeSequelizeTypes = (modelObj) => {
    _.forEach(modelObj.attributes, (field, key) => {
      const type = _.isString(field) ? field : field.type;
      assert(_.has(Sequelize, type), i18n.t('error.boot.database.type.invalid', {
        type,
        key,
      }));
      if (_.isString(field)) {
        field = Sequelize[type]; // eslint-disable-line no-param-reassign
      } else if (_.isObject(field)) {
        field.type = Sequelize[type]; // eslint-disable-line no-param-reassign
      }
    });
  };

  bootSequelize = async (databases) => {
    server.databases = {};
    for (const database of databases) { // eslint-disable-line no-restricted-syntax
      for (const model of database.models) { // eslint-disable-line no-restricted-syntax
        const modelObj = {
          options: {
            name: {
              singular: model.name,
              plural: model.conf.plural || `${model.name}s`,
            },
          },
        };
        const modelFiles = globSyncMultiple(model.glob);
        if (modelFiles.length) {
          const modelFile = modelFiles[0];
          _.merge(modelObj, require(modelFile));
        }
        _.merge(modelObj, {
          attributes: model.conf.attributes || {},
          options: model.conf.options || {},
        });

        this.normalizeSequelizeTypes(modelObj);

        database.sequelize.define(model.name, modelObj.attributes, modelObj.options);
      }
      server.databases[database.name] = database.sequelize;
    }
  };

  boot = async () => {
    const self = this;
    const databases = conf.get('databases');
    const sequelizeCollection = {};
    const dbMap = _.map(databases, (database, name) => {
      const {
        db,
        username,
        password,
      } = database;

      const dbConfig = _.omit(database, [
        'db',
        'username',
        'password',
      ]);

      const sequelize = new Sequelize(db, username || '', password || '', dbConfig);
      sequelizeCollection[name] = sequelize;
      const models = self.modelResolver.getModelConfs({
        database: name,
      });
      const resolvedModels = _.map(models, (modelConf, modelName) => {
        let modelPath;
        if (_.has(modelConf, 'location')) {
          modelPath = path.resolve(path.join(rootPath, modelConf.location));
          assert(fs.existsSync(modelPath), i18n.t('boot.database.model.notFound'));
        } else {
          const expectedModelName = `${modelName}Model.js`;
          modelPath = [
            path.join(rootPath, 'main/components', modelName, expectedModelName),
            path.join(rootPath, 'core/components', modelName, expectedModelName),
          ];
        }
        return {
          conf: modelConf,
          name: modelName,
          glob: modelPath,
        };
      });
      return {
        name,
        models: resolvedModels,
        sequelize,
      };
    });

    return self.bootSequelize(dbMap);
  }
}
