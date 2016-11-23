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
      clientId: '203247580127542',
      clientSecret: '08fbd9d63fc911634226c7ab97f7c344',
      isSecure: false,
    },
  },
};
