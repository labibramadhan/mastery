const secret = conf.get('secret');
const {
  validateJWT,
} = requireF('services/_core/authentications/authJWTServices');

export default {
  jwt: {
    type: 'jwt',
    config: {
      key: secret,
      validateFunc: validateJWT,
      verifyOptions: {
        algorithms: ['HS256'],
      },
    },
  },
};
