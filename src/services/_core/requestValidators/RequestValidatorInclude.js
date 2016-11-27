import _ from 'lodash';
import Joi from 'joi';

const RequestValidatorWhere = requireF('services/_core/requestValidators/RequestValidatorWhere');

export default class RequestValidatorInclude {
  constructor(models) {
    this.models = models;
    this.requestValidatorWhere = new RequestValidatorWhere();
  }
  build = () => {
    const {
      models,
      requestValidatorWhere,
    } = this;

    let validIncludeString = [];
    let validIncludeModel = [];
    let validIncludeWhere = [];
    let validIncludeAs = [];
    _.each(models, (m) => {
      const associatedModelNames = Object.keys(m.associations);
      const modelHasAssociations = associatedModelNames && associatedModelNames.length;
      const thisValidIncludeString = modelHasAssociations ?
        Joi.string().valid(...associatedModelNames) :
        Joi.valid(null);
      validIncludeString = [...validIncludeString, thisValidIncludeString];
      validIncludeModel = [...validIncludeModel, thisValidIncludeString];

      const whereValidation = requestValidatorWhere.build(m);
      validIncludeWhere = [...validIncludeWhere, Joi.alternatives().when('model', {
        is: m.name,
        then: whereValidation,
      })];

      const associatedModelAliases = _.map(m.associations, (assoc => assoc.as));
      validIncludeAs = [...validIncludeAs, Joi.alternatives().when('model', {
        is: m.name,
        then: Joi.string().valid(...associatedModelAliases),
      })];
    });

    const validIncludeObject = Joi.object().keys({
      model: validIncludeModel,
      where: validIncludeWhere,
      as: validIncludeAs,
      include: Joi.lazy(() => validInclude), // eslint-disable-line no-use-before-define
    });

    const validInclude = Joi.alternatives().try(
      Joi.array().items(validIncludeString, validIncludeObject),
      validIncludeString,
      validIncludeObject,
    );

    return Joi.object().keys({
      include: validInclude,
      'include[]': validInclude,
    });
  };
}
