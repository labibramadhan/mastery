import _ from 'lodash';

const {
  getPackage,
  getModels,
} = requireF('services/_core/commonServices');

export default class AuthJWTValidator {
  validate = async (decoded, request, callback) => {
    const {
      user,
      role,
    } = getModels(['user', 'role']);
    const availableRoles = server.plugins[`${getPackage().name}-acl`];

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
