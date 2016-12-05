import _ from 'lodash';

const {
  getPackage,
} = requireF('services/_core/CommonServices');

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

const PreHandlerValidatorFindAll = requireF('services/_core/preHandlerValidators/PreHandlerValidatorFindAll');
const PreHandlerValidatorFindOne = requireF('services/_core/preHandlerValidators/PreHandlerValidatorFindOne');
const PreHandlerValidatorFindById = requireF('services/_core/preHandlerValidators/PreHandlerValidatorFindById');
const PreHandlerValidatorCount = requireF('services/_core/preHandlerValidators/PreHandlerValidatorCount');
const PreHandlerValidatorUpdate = requireF('services/_core/preHandlerValidators/PreHandlerValidatorUpdate');
const PreHandlerValidatorDelete = requireF('services/_core/preHandlerValidators/PreHandlerValidatorDelete');
const PreHandlerValidatorAssociationFindOne = requireF('services/_core/preHandlerValidators/associations/PreHandlerValidatorAssociationFindOne');

const validatorClasses = {
  findAll: PreHandlerValidatorFindAll,
  findOne: PreHandlerValidatorFindOne,
  findById: PreHandlerValidatorFindById,
  count: PreHandlerValidatorCount,
  update: PreHandlerValidatorUpdate,
  delete: PreHandlerValidatorDelete,

  associationFindOne: PreHandlerValidatorAssociationFindOne,
};

const preHandlerValidator = async function preHandlerValidator(request, reply) {
  if (_.has(request.route.settings, 'plugins.generator.preHandlerValidators') &&
    request.route.settings.plugins.generator.preHandlerValidators.length) {
    const config = request.route.settings.plugins.generator;
    const resolverModels = new ResolverModels();

    let invalid;

    // eslint-disable-next-line no-restricted-syntax
    for (const validator of config.preHandlerValidators) {
      const association = validator.split('.').length === 3;
      const methodName = validator.substring(validator.lastIndexOf('.') + 1);
      if (!invalid && _.has(validatorClasses, methodName)) {
        const baseModelName = validator.substring(0, validator.indexOf('.'));
        const baseModel = resolverModels.getModel(baseModelName);

        let validatorClass;
        if (!association) {
          validatorClass = new validatorClasses[methodName](baseModel);
        } else {
          const associatedModelName = validator.substring(validator.indexOf('.') + 1, validator.lastIndexOf('.'));
          const associatedModel = resolverModels.getModel(associatedModelName);
          validatorClass = new validatorClasses[methodName](baseModel, associatedModel);
        }
        invalid = await validatorClass.validate(request);
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
