import Boom from 'boom';
import Platform from 'platform';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import moment from 'moment';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

const {
  maxSessions,
  secret,
} = conf.get();

export default class AuthJWTLogin {
  DEFAULT_EXPIRY = 604800;

  constructor(request) {
    this.request = request;
    this.modelResolver = new ModelResolver();
  }

  parseCredentials() {
    const {
      username,
      email,
      password,
    } = this.request.payload;

    let credentials = {
      password,
    };

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

  login = async (request, reply) => {
    const credentials = this.parseCredentials();
    const {
      user,
      session,
    } = this.modelResolver.getModels(['user', 'session']);

    const {
      password,
    } = credentials;

    const credentialsRequested = _.omit(credentials, 'password');

    // check if current credentials is valid in database
    const instance = await user.findOne({
      where: credentialsRequested,
    });
    if (instance && instance.validPassword(password)) {
      const existingSessions = await session.count({
        include: {
          model: user,
          where: {
            id: instance.id,
          },
        },
      });
      if (existingSessions >= maxSessions) {
        return Boom.unauthorized(this.request.t('error.user.login.tooManySessions'));
      }

      const token = await this.postLogin(request, instance, credentialsRequested);

      return reply({
        token,
      });
    }

    // if not valid, return the user.login.failed translated message
    return reply(Boom.unauthorized(this.t('error.user.login.failed')));
  }

  postLogin = async (request, user, credentialsRequested) => {
    const sessionModel = this.modelResolver.getModel('session');
    const expiry = moment().add(this.DEFAULT_EXPIRY, 's').unix();
    const oldSession = await sessionModel.findOne({
      where: {
        userId: user.id,
      },
    });
    if (oldSession) {
      await oldSession.update({
        expiry,
      });
      return oldSession.token;
    }

    const token = jwt.sign({
      id: user.id,
      ...credentialsRequested,
    }, secret);
    const platform = Platform.parse(request.headers['user-agent']);
    await sessionModel.create({
      userId: user.id,
      token,
      platform: platform.description,
      expiry,
    });
    return token;
  }
}
