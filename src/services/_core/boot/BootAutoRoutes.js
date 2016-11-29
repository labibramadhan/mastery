import _ from 'lodash';

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

const RouteGeneratorFindAll = requireF('services/_core/routeGenerators/RouteGeneratorFindAll');
const RouteGeneratorFindOne = requireF('services/_core/routeGenerators/RouteGeneratorFindOne');
const RouteGeneratorFindById = requireF('services/_core/routeGenerators/RouteGeneratorFindById');
const RouteGeneratorCount = requireF('services/_core/routeGenerators/RouteGeneratorCount');
const RouteGeneratorCreate = requireF('services/_core/routeGenerators/RouteGeneratorCreate');
const RouteGeneratorUpdate = requireF('services/_core/routeGenerators/RouteGeneratorUpdate');

export default class BootAutoRoutes {
  constructor() {
    this.resolverModels = new ResolverModels();
  }

  boot() {
    const self = this;
    const routes = [];
    const enabledModels = this.resolverModels.getModelConfs({ public: true });
    _.forEach(enabledModels, (enabledModel, modelName) => {
      if (_.has(enabledModel, 'methods')) {
        const model = self.resolverModels.getModel(modelName);

        if (_.has(enabledModel, 'methods.findAll') && enabledModel.methods.findAll) {
          const routeGeneratorFindAll = new RouteGeneratorFindAll(model);
          routes.push(routeGeneratorFindAll.generate());
        }

        if (_.has(enabledModel, 'methods.findOne') && enabledModel.methods.findOne) {
          const routeGeneratorFindOne = new RouteGeneratorFindOne(model);
          routes.push(routeGeneratorFindOne.generate());
        }

        if (_.has(enabledModel, 'methods.findById') && enabledModel.methods.findById) {
          const routeGeneratorFindById = new RouteGeneratorFindById(model);
          routes.push(routeGeneratorFindById.generate());
        }

        if (_.has(enabledModel, 'methods.count') && enabledModel.methods.count) {
          const routeGeneratorCount = new RouteGeneratorCount(model);
          routes.push(routeGeneratorCount.generate());
        }

        if (_.has(enabledModel, 'methods.create') && enabledModel.methods.create) {
          const routeGeneratorCreate = new RouteGeneratorCreate(model);
          routes.push(routeGeneratorCreate.generate());
        }

        if (_.has(enabledModel, 'methods.update') && enabledModel.methods.update) {
          const routeGeneratorUpdate = new RouteGeneratorUpdate(model);
          routes.push(routeGeneratorUpdate.generate());
        }
      }
    });
    server.route(routes);
  }
}
