import Joi from 'joi';

const RequestValidatorConstants = requireF('services/_core/requestValidators/RequestValidatorConstants.js');

export default class RequestValidatorWhere {
  build = (model) => {
    const modelAttributes = Object.keys(model.attributes);
    const validAttributes = modelAttributes.reduce((params, attribute) => {
      // TODO: use joi-sequelize
      params[attribute] = Joi.any(); // eslint-disable-line no-param-reassign
      return params;
    }, {});
    return Joi.object().keys({
      ...validAttributes,
      ...RequestValidatorConstants.SEQUELIZE_OPERATORS,
    });
  }
}
