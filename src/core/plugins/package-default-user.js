import _ from 'lodash';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

exports.register = async (server, options, next) => {
  const modelResolver = new ModelResolver();
  const userModel = modelResolver.getModel('user');

  server.ext('onRequest', async (request, reply) => {
    if (!(_.has(request, 'query.token') || _.has(request, 'headers.authorization'))) {
      const anonymousUser = await userModel.findOne({
        where: {
          username: 'anonymous',
        },
      });
      const defaultCredentials = _.pick(anonymousUser, ['id', 'username']);

      // eslint-disable-next-line no-param-reassign
      request.auth.credentials = defaultCredentials;
    }
    reply.continue();
  });

  return next();
};

exports.register.attributes = {
  name: 'package-default-user',
  version: '1.0.0',
};
