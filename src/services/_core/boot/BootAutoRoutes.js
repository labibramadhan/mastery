import _ from 'lodash';

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

export default class BootAutoRoutes {
  constructor() {
    this.resolverModels = new ResolverModels();
  }

  boot() {
    const enabledModels = this.resolverModels.getModelConfs({ public: true });
    _.forEach(enabledModels, (enabledModel) => {
      if (_.has(enabledModel, 'methods')) {
        if (_.has(enabledModel.methods.findAll) && enabledModel.methods.findAll) {
          //
        }
      }
    });
  }
}
