import Joi from 'joi';
import _ from 'lodash';

const ValidatorConstants = requireF('core/services/verifier/ValidatorConstants.js');

export default class WhereValidator {
  constructor(models, model) {
    this.model = model;
  }

  buildRaw() {
    const {
      SEQUELIZE_OPERATORS,
    } = ValidatorConstants;
    const modelAttributes = _.keys(this.model.attributes);
    const validAttributes = modelAttributes.reduce((params, attribute) => {
      params[attribute] = Joi.any(); // eslint-disable-line no-param-reassign
      return params;
    }, {});
    return {
      ...validAttributes,
      ...SEQUELIZE_OPERATORS,
    };
  }

  buildForInclude() {
    return Joi.object().keys({
      ...this.buildRaw(),
    });
  }

  build() {
    return Joi.object().keys({
      where: this.buildRaw(),
    });
  }
}
