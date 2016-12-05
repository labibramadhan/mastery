import _ from 'lodash';

const {
  concatToJoiObject,
  mergeJoiObject,
} = requireF('services/_core/CommonServices');

const RequestValidatorConstants = requireF('services/_core/validators/request/RequestValidatorConstants');
const RequestValidatorPK = requireF('services/_core/validators/request/RequestValidatorPK');
const RequestValidatorWhere = requireF('services/_core/validators/request/RequestValidatorWhere');
const RequestValidatorInclude = requireF('services/_core/validators/request/RequestValidatorInclude');
const RequestValidatorOrder = requireF('services/_core/validators/request/RequestValidatorOrder');
const RequestValidatorLimit = requireF('services/_core/validators/request/RequestValidatorLimit');
const RequestValidatorOffset = requireF('services/_core/validators/request/RequestValidatorOffset');
const RequestValidatorPayload = requireF('services/_core/validators/request/RequestValidatorPayload');
const RequestValidatorToken = requireF('services/_core/validators/request/RequestValidatorToken');

const validatorClasses = {
  pk: {
    class: RequestValidatorPK,
    source: 'params',
  },
  pk2: {
    class: RequestValidatorPK,
    source: 'params',
  },
  where: {
    class: RequestValidatorWhere,
    source: 'query',
  },
  include: {
    class: RequestValidatorInclude,
    source: 'query',
  },
  order: {
    class: RequestValidatorOrder,
    source: 'query',
  },
  limit: {
    class: RequestValidatorLimit,
    source: 'query',
  },
  offset: {
    class: RequestValidatorOffset,
    source: 'query',
  },
  payload: {
    class: RequestValidatorPayload,
    source: 'payload',
  },
  token: {
    class: RequestValidatorToken,
    source: 'query',
  },
};

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

export default class RequestValidatorGenerator {
  constructor() {
    const resolverModels = new ResolverModels();
    this.models = resolverModels.getAllModels();
  }

  build(method) {
    const {
      APPLICABLE_METHODS,
    } = RequestValidatorConstants;

    const validators = {};

    const methodName = method.substring(method.indexOf('.') + 1);
    let targetModelName = method.replace(methodName, '');
    targetModelName = targetModelName.substring(0, targetModelName.length - 1);
    _.forEach(APPLICABLE_METHODS[methodName], (sourceMethod) => {
      if (_.has(validatorClasses, sourceMethod)) {
        const classConfig = validatorClasses[sourceMethod];
        const classIntance = new classConfig['class'](this.models, this.models[targetModelName], sourceMethod); // eslint-disable-line
        const validations = concatToJoiObject(
          classIntance.build(),
          _.get(validators, classConfig.source),
        );
        _.set(validators, classConfig.source, validations);
      }
    });

    const tokenValidator = new validatorClasses['token']['class'](); // eslint-disable-line
    const tokenValidation = concatToJoiObject(
      tokenValidator.build(),
      _.get(validators, validatorClasses.token.source),
    );
    _.set(validators, validatorClasses.token.source, tokenValidation);

    return validators;
  }

  buildMultiple(methodNames) {
    const self = this;
    const {
      VALIDATABLE_REQUEST,
    } = RequestValidatorConstants;

    let allValidators = {};
    _.forEach(_.castArray(methodNames), (methodName) => {
      const validators = self.build(methodName);
      allValidators = mergeJoiObject(allValidators, validators, VALIDATABLE_REQUEST);
    });

    return allValidators;
  }
}
