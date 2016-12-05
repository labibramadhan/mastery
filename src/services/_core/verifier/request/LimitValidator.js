import Joi from 'joi';

export default class LimitValidator {
  build = () => Joi.object().keys({
    limit: Joi.number(),
  })
}
