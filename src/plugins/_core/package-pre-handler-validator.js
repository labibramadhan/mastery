import _ from 'lodash';

const {
  getPackage,
} = requireF('services/_core/commonServices');

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

const PreHandlerValidatorFindAll = requireF('services/_core/preHandlerValidators/PreHandlerValidatorFindAll');
const PreHandlerValidatorFindOne = requireF('services/_core/preHandlerValidators/PreHandlerValidatorFindOne');
const PreHandlerValidatorFindById = requireF('services/_core/preHandlerValidators/PreHandlerValidatorFindById');
const PreHandlerValidatorCount = requireF('services/_core/preHandlerValidators/PreHandlerValidatorCount');
const PreHandlerValidatorUpdate = requireF('services/_core/preHandlerValidators/PreHandlerValidatorUpdate');
const PreHandlerValidatorAssociationFindAll = requireF('services/_core/preHandlerValidators/associations/PreHandlerValidatorAssociationFindAll');
const PreHandlerValidatorAssociationFindOne = requireF('services/_core/preHandlerValidators/associations/PreHandlerValidatorAssociationFindOne');
const PreHandlerValidatorAssociationCount = requireF('services/_core/preHandlerValidators/associations/PreHandlerValidatorAssociationCount');

const preHandlerValidator = async function preHandlerValidator(request, reply) {
  const tags = request.route.settings.tags;

  if (tags && tags.includes('generator')) {
    const resolverModels = new ResolverModels();
    const modelName = tags[2];
    const model = resolverModels.getModel(modelName);
    const config = request.route.settings.plugins.package;
    const inherit = _.castArray(config.inherit);

    let invalid;

    if (!invalid && config.name === 'findAll') {
      const preHandlerValidatorFindAll = new PreHandlerValidatorFindAll(model);
      invalid = await preHandlerValidatorFindAll.validate(request);
    }

    if (!invalid && config.name === 'findOne') {
      const preHandlerValidatorFindOne = new PreHandlerValidatorFindOne(model);
      invalid = await preHandlerValidatorFindOne.validate(request);
    }

    if (!invalid && (config.name === 'findById' || inherit.includes('findById'))) {
      const preHandlerValidatorFindById = new PreHandlerValidatorFindById(model);
      invalid = await preHandlerValidatorFindById.validate(request);
    }

    if (!invalid && config.name === 'count') {
      const preHandlerValidatorCount = new PreHandlerValidatorCount(model);
      invalid = await preHandlerValidatorCount.validate(request);
    }

    if (!invalid && config.name === 'update') {
      const preHandlerValidatorUpdate = new PreHandlerValidatorUpdate(model);
      invalid = await preHandlerValidatorUpdate.validate(request);
    }

    if (config.association) {
      const association = model.associations[config.association];
      if (!invalid && config.name === 'findAllOneToMany') {
        const preHandlerValidatorAssociationFindAll =
          new PreHandlerValidatorAssociationFindAll(model, association);
        invalid = await preHandlerValidatorAssociationFindAll.validate(request);
      }

      if (!invalid && config.name === 'countOneToMany') {
        const preHandlerValidatorAssociationCount =
          new PreHandlerValidatorAssociationCount(model, association);
        invalid = await preHandlerValidatorAssociationCount.validate(request);
      }

      if (!invalid && config.name === 'findOneOneToOne') {
        const preHandlerValidatorAssociationFindOne =
          new PreHandlerValidatorAssociationFindOne(model, association);
        invalid = await preHandlerValidatorAssociationFindOne.validate(request);
      }
    }

    if (invalid && invalid.isBoom) {
      return reply(invalid);
    }
  }
  return reply.continue();
};

exports.register = async (server, options, next) => {
  server.ext('onPreHandler', preHandlerValidator);
  return next();
};

exports.register.attributes = {
  name: `${getPackage().name}-pre-handler-validator`,
  version: '1.0.0',
};
