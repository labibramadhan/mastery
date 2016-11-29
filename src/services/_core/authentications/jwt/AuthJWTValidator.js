import _ from 'lodash';

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

const {
  getPackage,
} = requireF('services/_core/commonServices');

export default class AuthJWTValidator {
  constructor() {
    this.resolverModels = new ResolverModels();
  }

  validate = async (decoded, request, callback) => {
    const {
      user,
      role,
    } = this.resolverModels.getModels(['user', 'role']);
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
