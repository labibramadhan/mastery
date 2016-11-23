import _ from 'lodash';
import Boom from 'boom';
import jwt from 'jsonwebtoken';

const locale = requireF('setup/_core/locales');
const {
  getPackage,
} = requireF('services/_core/commonServices');
const {
  maxSessions,
  secret,
} = requireF('setup/config/commonConfigs');

export const parseCredentials = (payload) => {
  const {
    username,
    email,
    password,
  } = payload;

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
};

export const postLoginJWT = async (user, token) => {
  const {
    session,
  } = server.plugins['hapi-sequelize'].db.models;
  await session.create({ userId: user.id, token, expire: 604800 });
};

export const loginJWT = async (credentials) => {
  const i18n = await locale();
  const {
    user,
    session,
  } = server.plugins['hapi-sequelize'].db.models;

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

    postLoginJWT(instance, token);

    return {
      token,
    };
  }

  // if not valid, return the user.login.failed translated message
  return Boom.unauthorized(i18n.t('user.login.failed'));
};

export const validateJWT = async (decoded, request, callback) => {
  const {
    user,
    role,
  } = request.server.plugins['hapi-sequelize'].db.models;
  const availableRoles = request.server.plugins[`${getPackage().name}-acl`];

  // store only id, username, and email inside decoded JWT token
  const credentials = _.pick(decoded, ['id', 'username', 'email']);

  // but find current requested user first
  const currentUser = await user.findOne({
    include: role,
    where: credentials,
  });
  if (currentUser) {
    // get current user roles name
    const userRoles = _.map(currentUser.roles, 'name');

    // get all current user permissions by its roles
    const userScopes = _.concat(..._.values(_.pick(availableRoles, userRoles)));
    return callback(null, true, {
      scope: userScopes,
      ...credentials,
    });
  }
  return callback(null, false);
};
