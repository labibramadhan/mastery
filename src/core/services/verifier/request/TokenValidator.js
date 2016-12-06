import Joi from 'joi';

export default class TokenValidator {
  build = () => {
    const JWTRegEx = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+$/g;
    return Joi.object().keys({
      token: Joi.string().regex(JWTRegEx),
    });
  }
}
