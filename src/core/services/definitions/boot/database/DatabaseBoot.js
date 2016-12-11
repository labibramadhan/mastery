import Fs from 'fs';
import Path from 'path';
import Sequelize from 'sequelize';
import _ from 'lodash';
import assert from 'assert';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

const {
  Boot,
} = requireF('core/services/EventsDecorator');

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

@Boot('database')
class DatabaseBoot { // eslint-disable-line no-unused-vars
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

  bootSequelize = (databases) => {
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
  }

  boot = () => {
    const databases = conf.get('databases');
    const modelResolver = new ModelResolver();
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
      const models = modelResolver.getModelConfs({
        database: name,
      });
      const resolvedModels = _.map(models, (modelConf, modelName) => {
        let modelPath;
        if (_.has(modelConf, 'location')) {
          modelPath = Path.resolve(Path.join(rootPath, modelConf.location));
          assert(Fs.existsSync(modelPath), i18n.t('boot.database.model.notFound'));
        } else {
          const expectedModelName = `${modelName}.model.js`;
          modelPath = [
            Path.join(rootPath, 'main/components', modelName, expectedModelName),
            Path.join(rootPath, 'core/components', modelName, expectedModelName),
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

    return this.bootSequelize(dbMap);
  }
}
