import _ from 'lodash';

const {
  concatToJoiObject,
  mergeJoiObject,
} = requireF('core/services/CommonServices');

const ValidatorConstants = requireF('core/services/verifier/ValidatorConstants');
const PKValidator = requireF('core/services/verifier/request/PKValidator');
const WhereValidator = requireF('core/services/verifier/request/WhereValidator');
const IncludeValidator = requireF('core/services/verifier/request/IncludeValidator');
const OrderValidator = requireF('core/services/verifier/request/OrderValidator');
const LimitValidator = requireF('core/services/verifier/request/LimitValidator');
const OffsetValidator = requireF('core/services/verifier/request/OffsetValidator');
const PayloadValidator = requireF('core/services/verifier/request/PayloadValidator');
const TokenValidator = requireF('core/services/verifier/request/TokenValidator');

const validatorClasses = {
  pk: {
    class: PKValidator,
    source: 'params',
  },
  pk2: {
    class: PKValidator,
    source: 'params',
  },
  where: {
    class: WhereValidator,
    source: 'query',
  },
  include: {
    class: IncludeValidator,
    source: 'query',
  },
  order: {
    class: OrderValidator,
    source: 'query',
  },
  limit: {
    class: LimitValidator,
    source: 'query',
  },
  offset: {
    class: OffsetValidator,
    source: 'query',
  },
  payload: {
    class: PayloadValidator,
    source: 'payload',
  },
  token: {
    class: TokenValidator,
    source: 'query',
  },
};

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

export default class ValidatorGenerator {
  constructor() {
    const modelResolver = new ModelResolver();
    this.models = modelResolver.getAllModels();
  }

  build(method) {
    const {
      APPLICABLE_METHODS,
    } = ValidatorConstants;

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
    } = ValidatorConstants;

    let allValidators = {};
    _.forEach(_.castArray(methodNames), (methodName) => {
      const validators = self.build(methodName);
      allValidators = mergeJoiObject(allValidators, validators, VALIDATABLE_REQUEST);
    });

    return allValidators;
  }
}
