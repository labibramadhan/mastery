import Joi from 'joi';

export default class RequestValidatorPK {
  build = (key = 'pk') => Joi.object().keys({
    [key]: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  });
}
