import _ from 'lodash';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

const FindAllRoute = requireF('core/services/generators/route/FindAllRoute');
const FindOneRoute = requireF('core/services/generators/route/FindOneRoute');
const FindByIdRoute = requireF('core/services/generators/route/FindByIdRoute');
const CountRoute = requireF('core/services/generators/route/CountRoute');
const CreateRoute = requireF('core/services/generators/route/CreateRoute');
const UpdateRoute = requireF('core/services/generators/route/UpdateRoute');
const DeleteRoute = requireF('core/services/generators/route/DeleteRoute');
const FindAllAssociationRoute = requireF('core/services/generators/route/associations/FindAllAssociationRoute');
const FindOneAssociationRoute = requireF('core/services/generators/route/associations/FindOneAssociationRoute');
const CountAssociationRoute = requireF('core/services/generators/route/associations/CountAssociationRoute');
const CreateAssociationRoute = requireF('core/services/generators/route/associations/CreateAssociationRoute');
const AddAssociationRoute = requireF('core/services/generators/route/associations/AddAssociationRoute');
const AddMultipleAssociationRoute = requireF('core/services/generators/route/associations/AddMultipleAssociationRoute');
const RemoveAssociationRoute = requireF('core/services/generators/route/associations/RemoveAssociationRoute');
const RemoveMultipleAssociationRoute = requireF('core/services/generators/route/associations/RemoveMultipleAssociationRoute');

const routeGeneratorClasses = {
  findAll: FindAllRoute,
  findOne: FindOneRoute,
  findById: FindByIdRoute,
  count: CountRoute,
  create: CreateRoute,
  update: UpdateRoute,
  delete: DeleteRoute,

  associations: {
    findAll: FindAllAssociationRoute,
    findOne: FindOneAssociationRoute,
    count: CountAssociationRoute,
    create: CreateAssociationRoute,
    add: AddAssociationRoute,
    addMultiple: AddMultipleAssociationRoute,
    remove: RemoveAssociationRoute,
    removeMultiple: RemoveMultipleAssociationRoute,
  },
};

export default class RouteGeneratorBoot {
  constructor() {
    this.modelResolver = new ModelResolver();
  }

  boot() {
    const self = this;
    const routes = [];
    const modelsConf = conf.get('models');
    _.forEach(modelsConf, (modelConf, modelName) => {
      if (_.has(modelConf, 'methods')) {
        const model = self.modelResolver.getModel(modelName);

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
