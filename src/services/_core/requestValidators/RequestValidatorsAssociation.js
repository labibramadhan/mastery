import _ from 'lodash';

const RequestValidators = requireF('services/_core/requestValidators/RequestValidators');
const ResolverModels = requireF('services/_core/resolvers/ResolverModels');
const RequestValidatorConstants = requireF('services/_core/requestValidators/RequestValidatorConstants');

const {
  mergeJoiObject,
} = requireF('services/_core/commonServices');

export default class RequestValidatorsAssociation {
  constructor({
    association,
    model,
  }) {
    const resolverModels = new ResolverModels();
    this.model = model;
    this.associatedModel = resolverModels.getModel(association.target.name);
  }

  build({
    inherit,
    methodName,
  }) {
    const {
      VALIDATABLE_REQUEST,
    } = RequestValidatorConstants;

    let validators = {};
    const inheritMethods = _.castArray(inherit);
    const requestValidators = new RequestValidators(this.model);
    _.forEach(inheritMethods, (inheritMethod) => {
      const inheritValidators = requestValidators.build(inheritMethod);
      validators = mergeJoiObject(validators, inheritValidators, VALIDATABLE_REQUEST);
    });

    const requestValidatorsChild = new RequestValidators(this.associatedModel);
    const validatorsChild = requestValidatorsChild.build(methodName);
    validators = mergeJoiObject(validators, validatorsChild, VALIDATABLE_REQUEST);

    return validators;
  }
}
