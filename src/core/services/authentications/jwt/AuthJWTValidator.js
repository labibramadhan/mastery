import _ from 'lodash';
import moment from 'moment';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

export default class AuthJWTValidator {
  constructor() {
    this.modelResolver = new ModelResolver();
  }

  validExistence = session => Boolean(session);

  validExpiry = (session) => {
    const currentTimestamp = moment().unix();
    if (session.expiry < currentTimestamp) {
      return false;
    }
    return true;
  }

  invalidToken = async (token) => {
    const sessionModel = this.modelResolver.getModel('session');
    const session = await sessionModel.findOne({
      where: {
        token,
      },
    });

    if (!this.validExistence(session)) {
      return true;
    }

    if (!this.validExpiry(session)) {
      return true;
    }

    return false;
  }

  validate = async (decoded, request, callback) => {
    const {
      user,
      role,
    } = this.modelResolver.getModels(['user', 'role']);
    const availableRoles = server.plugins['package-acl'];
    const token = _.get(request, 'query.token') || _.get(request, 'headers.authorization');

    const invalidToken = await this.invalidToken(token);
    if (invalidToken) {
      return callback(null, false);
    }

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
  }
}
