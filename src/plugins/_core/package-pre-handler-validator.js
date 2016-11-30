const {
  getPackage,
} = requireF('services/_core/commonServices');

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

const PreHandlerValidatorFindAll = requireF('services/_core/preHandlerValidators/PreHandlerValidatorFindAll');
const PreHandlerValidatorFindOne = requireF('services/_core/preHandlerValidators/PreHandlerValidatorFindOne');
const PreHandlerValidatorFindById = requireF('services/_core/preHandlerValidators/PreHandlerValidatorFindById');
const PreHandlerValidatorCount = requireF('services/_core/preHandlerValidators/PreHandlerValidatorCount');
const PreHandlerValidatorUpdate = requireF('services/_core/preHandlerValidators/PreHandlerValidatorUpdate');

const preHandlerValidator = async function preHandlerValidator(request, reply) {
  const tags = request.route.settings.tags;

  if (tags && tags.includes('generator')) {
    const resolverModels = new ResolverModels();
    const modelName = tags[2];
    const model = resolverModels.getModel(modelName);

    let valid;
    if (tags.includes('findAll')) {
      const preHandlerValidatorFindAll = new PreHandlerValidatorFindAll(model);
      valid = await preHandlerValidatorFindAll.validate(request);
    } else if (tags.includes('findOne')) {
      const preHandlerValidatorFindOne = new PreHandlerValidatorFindOne(model);
      valid = await preHandlerValidatorFindOne.validate(request);
    } else if (tags.includes('findById')) {
      const preHandlerValidatorFindById = new PreHandlerValidatorFindById(model);
      valid = await preHandlerValidatorFindById.validate(request);
    } else if (tags.includes('count')) {
      const preHandlerValidatorCount = new PreHandlerValidatorCount(model);
      valid = await preHandlerValidatorCount.validate(request);
    } else if (tags.includes('update')) {
      const preHandlerValidatorUpdate = new PreHandlerValidatorUpdate(model);
      valid = await preHandlerValidatorUpdate.validate(request);
    }

    if (valid && valid.isBoom) {
      return reply(valid);
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
