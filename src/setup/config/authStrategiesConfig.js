const {
  secret,
} = requireF('setup/config/commonConfigs');
const {
  validateJWT,
} = requireF('services/_core/authJWTServices');

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
  facebook: {
    type: 'bell',
    config: {
      provider: 'facebook',
      password: secret,
      clientId: '792735237441141',
      clientSecret: '8bbbb1fa1b6596a5cfc7c4fab56c1016',
      isSecure: false,
    },
  },
};
