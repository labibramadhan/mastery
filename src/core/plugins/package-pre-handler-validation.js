import _ from 'lodash';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

const PreFindAllValidation = requireF('core/services/verifier/preHandler/PreFindAllValidation');
const PreFindOneValidation = requireF('core/services/verifier/preHandler/PreFindOneValidation');
const PreFindByIdValidation = requireF('core/services/verifier/preHandler/PreFindByIdValidation');
const PreCountValidation = requireF('core/services/verifier/preHandler/PreCountValidation');
const PreUpdateValidation = requireF('core/services/verifier/preHandler/PreUpdateValidation');
const PreDeleteValidation = requireF('core/services/verifier/preHandler/PreDeleteValidation');
const PreAssociationFindValidation = requireF('core/services/verifier/preHandler/associations/PreAssociationFindValidation');

const validatorClasses = {
  findAll: PreFindAllValidation,
  findOne: PreFindOneValidation,
  findById: PreFindByIdValidation,
  count: PreCountValidation,
  update: PreUpdateValidation,
  delete: PreDeleteValidation,

  associationFind: PreAssociationFindValidation,
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
          const associationAs = validator.substring(validator.indexOf('.') + 1, validator.lastIndexOf('.'));
          validatorClass = new validatorClasses[methodName](
            baseModel,
            baseModel.associations[associationAs],
          );
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
  name: 'package-pre-handler-validation',
  version: '1.0.0',
};
