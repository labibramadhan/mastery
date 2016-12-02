import _ from 'lodash';

const {
  concatToJoiObject,
} = requireF('services/_core/CommonServices');

const RequestValidatorConstants = requireF('services/_core/requestValidators/RequestValidatorConstants');
const RequestValidatorPK = requireF('services/_core/requestValidators/RequestValidatorPK');
const RequestValidatorWhere = requireF('services/_core/requestValidators/RequestValidatorWhere');
const RequestValidatorInclude = requireF('services/_core/requestValidators/RequestValidatorInclude');
const RequestValidatorOrder = requireF('services/_core/requestValidators/RequestValidatorOrder');
const RequestValidatorLimit = requireF('services/_core/requestValidators/RequestValidatorLimit');
const RequestValidatorOffset = requireF('services/_core/requestValidators/RequestValidatorOffset');
const RequestValidatorPayload = requireF('services/_core/requestValidators/RequestValidatorPayload');
const RequestValidatorToken = requireF('services/_core/requestValidators/RequestValidatorToken');

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

export default class RequestValidators {
  constructor(model) {
    const resolverModels = new ResolverModels();

    this.models = resolverModels.getAllModels();
    this.requestValidatorPK = new RequestValidatorPK();
    this.requestValidatorWhere = new RequestValidatorWhere(model);
    this.requestValidatorInclude = new RequestValidatorInclude(this.models);
    this.requestValidatorOrder = new RequestValidatorOrder(this.models, model);
    this.requestValidatorPayload = new RequestValidatorPayload(model);
    this.requestValidatorLimit = new RequestValidatorLimit();
    this.requestValidatorOffset = new RequestValidatorOffset();
    this.requestValidatorToken = new RequestValidatorToken();
  }

  build(methodName) {
    const {
      APPLICABLE_METHODS,
    } = RequestValidatorConstants;

    const validators = {};

    const hasPK = APPLICABLE_METHODS[methodName].includes('pk');
    const hasWhere = APPLICABLE_METHODS[methodName].includes('where');
    const hasInclude = APPLICABLE_METHODS[methodName].includes('include');
    const hasOrder = APPLICABLE_METHODS[methodName].includes('order');
    const hasLimit = APPLICABLE_METHODS[methodName].includes('limit');
    const hasOffset = APPLICABLE_METHODS[methodName].includes('offset');
    const hasPayload = APPLICABLE_METHODS[methodName].includes('payload');

    if (hasPK) {
      const pkValidation = concatToJoiObject(
        this.requestValidatorPK.build(),
        _.get(validators, 'params'),
      );
      _.set(validators, 'params', pkValidation);
    }

    if (hasWhere) {
      const whereValidation = concatToJoiObject(
        this.requestValidatorWhere.build(),
        _.get(validators, 'query'),
      );
      _.set(validators, 'query', whereValidation);
    }

    if (hasInclude) {
      const includeValidation = concatToJoiObject(
        this.requestValidatorInclude.build(),
        _.get(validators, 'query'),
      );
      _.set(validators, 'query', includeValidation);
    }

    if (hasOrder) {
      const orderValidation = concatToJoiObject(
        this.requestValidatorOrder.build(),
        _.get(validators, 'query'),
      );
      _.set(validators, 'query', orderValidation);
    }

    if (hasLimit) {
      const limitValidation = concatToJoiObject(
        this.requestValidatorLimit.build(),
        _.get(validators, 'query'),
      );
      _.set(validators, 'query', limitValidation);
    }

    if (hasOffset) {
      const offsetValidation = concatToJoiObject(
        this.requestValidatorOffset.build(),
        _.get(validators, 'query'),
      );
      _.set(validators, 'query', offsetValidation);
    }

    if (hasPayload) {
      const payloadValidation = concatToJoiObject(
        this.requestValidatorPayload.build(),
        _.get(validators, 'payload'),
      );
      _.set(validators, 'payload', payloadValidation);
    }

    const tokenValidation = concatToJoiObject(
      this.requestValidatorToken.build(),
      _.get(validators, 'query'),
    );
    _.set(validators, 'query', tokenValidation);

    return validators;
  }
}
