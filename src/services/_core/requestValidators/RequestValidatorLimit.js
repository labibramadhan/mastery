import Joi from 'joi';

export default class RequestValidatorLimit {
  build = () => Joi.object().keys({
    limit: Joi.number(),
  })
}
