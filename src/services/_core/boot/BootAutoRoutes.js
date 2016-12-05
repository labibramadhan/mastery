import _ from 'lodash';

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

const RouteGeneratorFindAll = requireF('services/_core/routeGenerators/RouteGeneratorFindAll');
const RouteGeneratorFindOne = requireF('services/_core/routeGenerators/RouteGeneratorFindOne');
const RouteGeneratorFindById = requireF('services/_core/routeGenerators/RouteGeneratorFindById');
const RouteGeneratorCount = requireF('services/_core/routeGenerators/RouteGeneratorCount');
const RouteGeneratorCreate = requireF('services/_core/routeGenerators/RouteGeneratorCreate');
const RouteGeneratorUpdate = requireF('services/_core/routeGenerators/RouteGeneratorUpdate');
const RouteGeneratorDelete = requireF('services/_core/routeGenerators/RouteGeneratorDelete');
const RouteGeneratorAssociationFindAll = requireF('services/_core/routeGenerators/associations/RouteGeneratorAssociationFindAll');
const RouteGeneratorAssociationFindOne = requireF('services/_core/routeGenerators/associations/RouteGeneratorAssociationFindOne');
const RouteGeneratorAssociationCount = requireF('services/_core/routeGenerators/associations/RouteGeneratorAssociationCount');
const RouteGeneratorAssociationCreate = requireF('services/_core/routeGenerators/associations/RouteGeneratorAssociationCreate');
const RouteGeneratorAssociationAdd = requireF('services/_core/routeGenerators/associations/RouteGeneratorAssociationAdd');
const RouteGeneratorAssociationAddMultiple = requireF('services/_core/routeGenerators/associations/RouteGeneratorAssociationAddMultiple');
const RouteGeneratorAssociationRemove = requireF('services/_core/routeGenerators/associations/RouteGeneratorAssociationRemove');
const RouteGeneratorAssociationRemoveMultiple = requireF('services/_core/routeGenerators/associations/RouteGeneratorAssociationRemoveMultiple');

const routeGeneratorClasses = {
  findAll: RouteGeneratorFindAll,
  findOne: RouteGeneratorFindOne,
  findById: RouteGeneratorFindById,
  count: RouteGeneratorCount,
  create: RouteGeneratorCreate,
  update: RouteGeneratorUpdate,
  delete: RouteGeneratorDelete,

  associations: {
    findAll: RouteGeneratorAssociationFindAll,
    findOne: RouteGeneratorAssociationFindOne,
    count: RouteGeneratorAssociationCount,
    create: RouteGeneratorAssociationCreate,
    add: RouteGeneratorAssociationAdd,
    addMultiple: RouteGeneratorAssociationAddMultiple,
    remove: RouteGeneratorAssociationRemove,
    removeMultiple: RouteGeneratorAssociationRemoveMultiple,
  },
};

export default class BootAutoRoutes {
  constructor() {
    this.resolverModels = new ResolverModels();
  }

  boot() {
    const self = this;
    const routes = [];
    const modelsConf = conf.get('models');
    _.forEach(modelsConf, (modelConf, modelName) => {
      if (_.has(modelConf, 'methods')) {
        const model = self.resolverModels.getModel(modelName);

        _.forEach(_.omit(modelConf.methods, 'associations'), (methodConf, methodName) => {
          if (_.has(routeGeneratorClasses, methodName)) {
            const routeGenerator = new routeGeneratorClasses[methodName](model);
            routes.push(routeGenerator.generate());
          }
        });

        if (_.has(modelConf.methods, 'associations')) {
          _.forEach(modelConf.methods.associations, (associationMethods, associationAs) => {
            _.forEach(associationMethods, (associationMethodConf, associationMethodName) => {
              if (_.has(routeGeneratorClasses, `associations.${associationMethodName}`)) {
                // eslint-disable-next-line dot-notation
                const routeGenerator = new routeGeneratorClasses['associations'][associationMethodName](model, model.associations[associationAs]);
                routes.push(routeGenerator.generate());
              }
            });
          });
        }
      }
    });
    server.route(routes);
  }
}
