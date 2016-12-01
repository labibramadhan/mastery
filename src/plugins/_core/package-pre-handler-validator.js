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

const preHandlerValidator = async function preHandlerValidator(request, reply) {
  const tags = request.route.settings.tags;

  if (tags && tags.includes('generator')) {
    const resolverModels = new ResolverModels();
    const modelName = tags[2];
    const model = resolverModels.getModel(modelName);

    let invalid;
    if (tags.includes('findAll')) {
      const preHandlerValidatorFindAll = new PreHandlerValidatorFindAll(model);
      invalid = await preHandlerValidatorFindAll.validate(request);
    } else if (tags.includes('findOne')) {
      const preHandlerValidatorFindOne = new PreHandlerValidatorFindOne(model);
      invalid = await preHandlerValidatorFindOne.validate(request);
    } else if (tags.includes('findById')) {
      const preHandlerValidatorFindById = new PreHandlerValidatorFindById(model);
      invalid = await preHandlerValidatorFindById.validate(request);
    } else if (tags.includes('count')) {
      const preHandlerValidatorCount = new PreHandlerValidatorCount(model);
      invalid = await preHandlerValidatorCount.validate(request);
    } else if (tags.includes('update')) {
      const preHandlerValidatorUpdate = new PreHandlerValidatorUpdate(model);
      invalid = await preHandlerValidatorUpdate.validate(request);
    } else if (tags.includes('findAllOneToMany')) {
      const associationAs = tags[4];
      const association = model.associations[associationAs];
      const preHandlerValidatorAssociationFindAll =
        new PreHandlerValidatorAssociationFindAll(model, association);
      invalid = await preHandlerValidatorAssociationFindAll.validate(request);
    } else if (tags.includes('countOneToMany')) {
      // const associationAs = tags[4];
      // const association = model.associations[associationAs];
      // const preHandlerValidatorAssociationCount =
      //   new PreHandlerValidatorAssociationCount(model, association);
      // invalid = await preHandlerValidatorAssociationCount.validate(request);
    } else if (tags.includes('findOneOneToOne')) {
      const associationAs = tags[4];
      const association = model.associations[associationAs];
      const preHandlerValidatorAssociationFindOne =
        new PreHandlerValidatorAssociationFindOne(model, association);
      invalid = await preHandlerValidatorAssociationFindOne.validate(request);
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
