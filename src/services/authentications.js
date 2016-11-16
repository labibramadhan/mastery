import _ from 'lodash';

import { getPackage } from '../services/commonServices';

export const validateAuth = async (decoded, request, callback) => {
  const { user, role } = request.server.plugins['hapi-sequelize'].db.models;
  const availableRoles = request.server.plugins[`${getPackage().name}-roles`];

  // pick only necessary object keys, in this case are username, email, and password
  const requestedCredentials = _.pick(decoded, ['username', 'email', 'password']);

  // find current requested user
  const currentUser = await user.findOne({
    include: role,
    where: requestedCredentials
  });
  if (currentUser) {
    // get current user roles name
    const userRoles = _.map(currentUser.roles, 'name');

    // store only id, username, and email inside decoded JWT token
    const credentials = _.pick(currentUser, ['id', 'username', 'email']);

    // get all current user permissions by its roles
    const userScopes = _.concat(..._.values(_.pick(availableRoles, userRoles)));
    return callback(null, true, {
      scope: userScopes,
      ...credentials,
    });
  }
  callback(null, false);
};