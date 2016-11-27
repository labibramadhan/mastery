import Joi from 'joi';

export default class RequestValidatorPayload {
  build = (model) => {
    const modelAttributes = Object.keys(model.attributes);
    const validAttributes = modelAttributes.reduce((params, attribute) => {
      // TODO: use joi-sequelize
      params[attribute] = Joi.any(); // eslint-disable-line no-param-reassign
      return params;
    }, {});
    return Joi.object().keys({
      ...validAttributes,
    });
  }
}
