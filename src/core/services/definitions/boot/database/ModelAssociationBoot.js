import Promise from 'bluebird';
import _ from 'lodash';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

const {
  Boot,
} = requireF('core/services/EventsDecorator');

@Boot('database')
class ModelAssociationBoot { // eslint-disable-line no-unused-vars
  boot = async () => {
    const promises = [];
    const modelResolver = new ModelResolver();
    const models = modelResolver.getAllModels();
    _.forEach(modelResolver.databases, (database, databaseName) => {
      _.forEach(database.models, (modelInstance) => {
        const relationships = conf.get(`models:${modelInstance.name}:relationships`);
        if (relationships) {
          _.forEach(relationships, (relationship) => {
            const {
              type,
              model,
            } = relationship;
            const associationConfig = _.omit(relationship, ['type', 'model']);
            if (_.has(associationConfig, 'through')) {
              associationConfig.through = models[associationConfig.through];
            }
            if (_.has(associationConfig, 'as')) {
              if (type === 'hasOne' || type === 'belongsTo') {
                associationConfig.as = model;
              }
            }
            modelInstance[type](models[model], associationConfig);
          });
        }
      });
      const sync = conf.get(`databases:${databaseName}:sync`);
      const forceSync = conf.get(`databases:${databaseName}:forceSync`);
      if (sync) {
        promises.push(database.sync({
          force: Boolean(forceSync),
        }));
      }
    });
    await Promise.all(promises);
  }
}
