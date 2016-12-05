import _ from 'lodash';
import Promise from 'bluebird';

const ModelResolver = requireF('services/_core/resolvers/ModelResolver');

export default class ModelAssociationBoot {
  constructor() {
    this.modelResolver = new ModelResolver();
  }

  boot = async () => {
    const promises = [];
    const models = this.modelResolver.getAllModels();
    _.forEach(this.modelResolver.databases, (database, databaseName) => {
      _.forEach(database.sequelize.models, (modelInstance) => {
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
            modelInstance[type](models[model], associationConfig);
          });
        }
      });
      const sync = conf.get(`databases:${databaseName}:sync`);
      const forceSync = conf.get(`databases:${databaseName}:forceSync`);
      if (sync) {
        promises.push(database.sequelize.sync({
          force: Boolean(forceSync),
        }));
      }
    });
    await Promise.all(promises);
  }
}
