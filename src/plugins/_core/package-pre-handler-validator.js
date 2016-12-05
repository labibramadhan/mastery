import _ from 'lodash';

const {
  getPackage,
} = requireF('services/_core/CommonServices');

const ModelResolver = requireF('services/_core/resolvers/ModelResolver');

const PreFindAllValidation = requireF('services/_core/verifier/preHandler/PreFindAllValidation');
const PreFindOneValidation = requireF('services/_core/verifier/preHandler/PreFindOneValidation');
const PreFindByIdValidation = requireF('services/_core/verifier/preHandler/PreFindByIdValidation');
const PreCountValidation = requireF('services/_core/verifier/preHandler/PreCountValidation');
const PreUpdateValidation = requireF('services/_core/verifier/preHandler/PreUpdateValidation');
const PreDeleteValidation = requireF('services/_core/verifier/preHandler/PreDeleteValidation');
const PreAssociationFindOneValidation = requireF('services/_core/verifier/preHandler/associations/PreAssociationFindOneValidation');

const validatorClasses = {
  findAll: PreFindAllValidation,
  findOne: PreFindOneValidation,
  findById: PreFindByIdValidation,
  count: PreCountValidation,
  update: PreUpdateValidation,
  delete: PreDeleteValidation,

  associationFindOne: PreAssociationFindOneValidation,
};

const preHandlerValidator = async function preHandlerValidator(request, reply) {
  if (_.has(request.route.settings, 'plugins.generator.preHandlerValidators') &&
    request.route.settings.plugins.generator.preHandlerValidators.length) {
    const config = request.route.settings.plugins.generator;
    const modelResolver = new ModelResolver();

    let invalid;

    // eslint-disable-next-line no-restricted-syntax
    for (const validator of config.preHandlerValidators) {
      const association = validator.split('.').length === 3;
      const methodName = validator.substring(validator.lastIndexOf('.') + 1);
      if (!invalid && _.has(validatorClasses, methodName)) {
        const baseModelName = validator.substring(0, validator.indexOf('.'));
        const baseModel = modelResolver.getModel(baseModelName);

        let validatorClass;
        if (!association) {
          validatorClass = new validatorClasses[methodName](baseModel);
        } else {
          const associatedModelName = validator.substring(validator.indexOf('.') + 1, validator.lastIndexOf('.'));
          const associatedModel = modelResolver.getModel(associatedModelName);
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
