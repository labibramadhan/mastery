import _ from 'lodash';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

const FindAllRoute = requireF('core/services/generators/route/FindAllRoute');
const FindOneRoute = requireF('core/services/generators/route/FindOneRoute');
const FindByIdRoute = requireF('core/services/generators/route/FindByIdRoute');
const CountRoute = requireF('core/services/generators/route/CountRoute');
const CreateRoute = requireF('core/services/generators/route/CreateRoute');
const UpdateRoute = requireF('core/services/generators/route/UpdateRoute');
const DeleteRoute = requireF('core/services/generators/route/DeleteRoute');
const FindAssociationRoute = requireF('core/services/generators/route/associations/FindAssociationRoute');
const CountAssociationRoute = requireF('core/services/generators/route/associations/CountAssociationRoute');
const CreateAssociationRoute = requireF('core/services/generators/route/associations/CreateAssociationRoute');
const HasAssociationRoute = requireF('core/services/generators/route/associations/HasAssociationRoute');
const HasAllAssociationRoute = requireF('core/services/generators/route/associations/HasAllAssociationRoute');
const SetAssociationRoute = requireF('core/services/generators/route/associations/SetAssociationRoute');
const LinkAssociationRoute = requireF('core/services/generators/route/associations/LinkAssociationRoute');
const LinkMultipleAssociationRoute = requireF('core/services/generators/route/associations/LinkMultipleAssociationRoute');
const UnlinkAssociationRoute = requireF('core/services/generators/route/associations/UnlinkAssociationRoute');
const UnlinkMultipleAssociationRoute = requireF('core/services/generators/route/associations/UnlinkMultipleAssociationRoute');

const routeGeneratorClasses = {
  findAll: FindAllRoute,
  findOne: FindOneRoute,
  findById: FindByIdRoute,
  count: CountRoute,
  create: CreateRoute,
  update: UpdateRoute,
  delete: DeleteRoute,

  associations: {
    find: FindAssociationRoute,
    count: CountAssociationRoute,
    create: CreateAssociationRoute,
    set: SetAssociationRoute,
    has: HasAssociationRoute,
    hasAll: HasAllAssociationRoute,
    link: LinkAssociationRoute,
    linkMultiple: LinkMultipleAssociationRoute,
    unlink: UnlinkAssociationRoute,
    unlinkMultiple: UnlinkMultipleAssociationRoute,
  },
};

const {
  Boot,
} = requireF('core/services/EventsDecorator');

@Boot('main')
class GenerateRoutes { // eslint-disable-line no-unused-vars
  boot = () => {
    const routes = [];
    const modelsConf = conf.get('models');
    const modelResolver = new ModelResolver();
    _.forEach(modelsConf, (modelConf, modelName) => {
      if (_.has(modelConf, 'methods')) {
        const model = modelResolver.getModel(modelName);

        _.forEach(_.omit(modelConf.methods, 'associations'), (methodConf, methodName) => {
          if (methodConf) {
            if (_.has(routeGeneratorClasses, methodName)) {
              const routeGenerator = new routeGeneratorClasses[methodName](model);
              routes.push(routeGenerator.generate());
            }
          }
        });

        if (_.has(modelConf.methods, 'associations')) {
          _.forEach(modelConf.methods.associations, (associationMethods, associationAs) => {
            _.forEach(associationMethods, (associationMethodConf, associationMethodName) => {
              if (_.has(routeGeneratorClasses, `associations.${associationMethodName}`)) {
                const routeGenerator = new routeGeneratorClasses
                  .associations[associationMethodName](
                    model,
                    model.associations[associationAs],
                  );
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
