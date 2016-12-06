import _ from 'lodash';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

export default class AuthJWTValidator {
  constructor() {
    this.modelResolver = new ModelResolver();
  }

  validate = async (decoded, request, callback) => {
    const {
      user,
      role,
    } = this.modelResolver.getModels(['user', 'role']);
    const availableRoles = server.plugins['package-acl'];

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
