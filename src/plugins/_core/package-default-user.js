import _ from 'lodash';

const {
  getPackage,
} = requireF('services/_core/CommonServices');

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

exports.register = async (server, options, next) => {
  const resolverModels = new ResolverModels();
  const userModel = resolverModels.getModel('user');

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
  name: `${getPackage().name}-default-user`,
  version: '1.0.0',
};
