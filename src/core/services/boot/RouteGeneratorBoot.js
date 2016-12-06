import _ from 'lodash';

const ModelResolver = requireF('services/_core/resolvers/ModelResolver');

const FindAllRoute = requireF('services/_core/generators/route/FindAllRoute');
const FindOneRoute = requireF('services/_core/generators/route/FindOneRoute');
const FindByIdRoute = requireF('services/_core/generators/route/FindByIdRoute');
const CountRoute = requireF('services/_core/generators/route/CountRoute');
const CreateRoute = requireF('services/_core/generators/route/CreateRoute');
const UpdateRoute = requireF('services/_core/generators/route/UpdateRoute');
const DeleteRoute = requireF('services/_core/generators/route/DeleteRoute');
const FindAllAssociationRoute = requireF('services/_core/generators/route/associations/FindAllAssociationRoute');
const FindOneAssociationRoute = requireF('services/_core/generators/route/associations/FindOneAssociationRoute');
const CountAssociationRoute = requireF('services/_core/generators/route/associations/CountAssociationRoute');
const CreateAssociationRoute = requireF('services/_core/generators/route/associations/CreateAssociationRoute');
const AddAssociationRoute = requireF('services/_core/generators/route/associations/AddAssociationRoute');
const AddMultipleAssociationRoute = requireF('services/_core/generators/route/associations/AddMultipleAssociationRoute');
const RemoveAssociationRoute = requireF('services/_core/generators/route/associations/RemoveAssociationRoute');
const RemoveMultipleAssociationRoute = requireF('services/_core/generators/route/associations/RemoveMultipleAssociationRoute');

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
