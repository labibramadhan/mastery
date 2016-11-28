import _ from 'lodash';
import Boom from 'boom';
import jwt from 'jsonwebtoken';

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

const {
  maxSessions,
  secret,
} = conf.get();

export default class AuthJWTLogin {
  constructor(payload) {
    this.payload = payload;
    this.resolverModels = new ResolverModels();
  }

  parseCredentials() {
    const {
      username,
      email,
      password,
    } = this.payload;

    let credentials = { password };

    if (username) {
      // login with username
      credentials = {
        username,
        ...credentials,
      };
    } else if (email) {
      // login with email
      credentials = {
        email,
        ...credentials,
      };
    }

    return credentials;
  }

  login = async () => {
    const credentials = this.parseCredentials();
    const {
      user,
      session,
    } = this.resolverModels.getModels(['user', 'session']);

    const {
      password,
    } = credentials;

    const credentialsRequested = _.omit(credentials, 'password');

    // check if current credentials is valid in database
    const instance = await user.findOne({
      where: credentialsRequested,
    });
    if (instance && instance.validPassword(password)) {
      const existingTokenCount = await session.count({
        include: {
          model: user,
          where: {
            id: instance.id,
          },
        },
      });
      if (existingTokenCount >= maxSessions) {
        return Boom.unauthorized(i18n.t('user.login.tooManySessions'));
      }

      // if valid, generate a new JWT token
      const token = jwt.sign({
        id: instance.id,
        ...credentialsRequested,
      }, secret);

      this.postLogin(instance, token);

      return {
        token,
      };
    }

    // if not valid, return the user.login.failed translated message
    return Boom.unauthorized(i18n.t('user.login.failed'));
  }

  postLogin = async (user, token) => {
    const session = this.resolverModels.getModel('session');
    await session.create({ userId: user.id, token, expire: 604800 });
  }
}
