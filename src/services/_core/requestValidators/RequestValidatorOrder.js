import _ from 'lodash';
import Joi from 'joi';

export default class RequestValidatorOrder {
  constructor(models, model) {
    this.models = models;
    this.model = model;
  }
  build() {
    const validString = Joi.string().valid(this.stringValidation());
    return Joi.object().keys({
      order: [
        validString,
        this.objectValidation(),
        Joi.array().items(validString, this.objectValidation()),
      ],
    });
  }

  stringValidation() {
    const validItems = [];
    const modelAttributes = _.keys(this.model.attributes);
    _.forEach(modelAttributes, (attribute) => {
      validItems.push(`${attribute} DESC`);
      validItems.push(`${attribute} desc`);
      validItems.push(`${attribute} ASC`);
      validItems.push(`${attribute} asc`);
    });
    return validItems;
  }

  objectValidation() {
    const self = this;
    const validFields = [
      Joi.alternatives().when('model', {
        is: Joi.any().empty(),
        then: Joi.valid(_.keys(self.model.attributes)),
      }),
    ];
    const associations = _.map(self.model.associations, association => association.target.name);
    _.forEach(associations, (modelName) => {
      const modelAssociation = self.models[modelName];
      validFields.push(Joi.alternatives().when('model', {
        is: modelName,
        then: Joi.string().valid(_.keys(modelAssociation.attributes)).required(),
      }));
    });
    return Joi.object().keys({
      model: Joi.string().valid(associations).optional(),
      field: Joi.alternatives().try(validFields).required(),
      sort: Joi.string().valid('DESC', 'desc', 'ASC', 'asc').required(),
    });
  }
}
