import Joi from 'joi';

export default class RequestValidatorPK {
  constructor(models, model, sourceMethod) {
    this.sourceMethod = sourceMethod;
  }
  build = () => Joi.object().keys({
    [this.sourceMethod]: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  });
}
