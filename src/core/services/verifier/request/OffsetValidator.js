import Joi from 'joi';

export default class OffsetValidator {
  build = () => Joi.object().keys({
    offset: Joi.number(),
  })
}
