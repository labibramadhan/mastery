import Joi from 'joi';

export default class RequestValidatorOffset {
  build = () => Joi.object().keys({
    offset: Joi.number(),
  })
}
