const secret = conf.get('secret');
const AuthJWTValidator = requireF('core/services/authentications/jwt/AuthJWTValidator');
const authJWTValidator = new AuthJWTValidator();

export default {
  jwt: {
    type: 'jwt',
    config: {
      key: secret,
      validateFunc: authJWTValidator.validate,
      verifyOptions: {
        algorithms: ['HS256'],
      },
    },
  },
};
