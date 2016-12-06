import Joi from 'joi';
import _ from 'lodash';

const WhereValidator = requireF('core/services/verifier/request/WhereValidator');

export default class IncludeValidator {
  constructor(models) {
    this.models = models;
    this.whereValidator = new WhereValidator();
  }
  build() {
    let validIncludeString = [];
    let validIncludeModel = [];
    let validIncludeWhere = [];
    let validIncludeAs = [];
    _.each(this.models, (m) => {
      const associatedModelNames = Object.keys(m.associations);
      const modelHasAssociations = associatedModelNames && associatedModelNames.length;
      const thisValidIncludeString = modelHasAssociations ?
        Joi.string().valid(...associatedModelNames) :
        Joi.valid(null);
      validIncludeString = [...validIncludeString, thisValidIncludeString];
      validIncludeModel = [...validIncludeModel, thisValidIncludeString];

      this.whereValidator.model = m;
      const whereValidation = this.whereValidator.buildForInclude();
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
    });
  }
}
