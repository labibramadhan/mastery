import Path from 'path';

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

exports.register = async (server, options, next) => {
  let availableRoles = {};
  const rolesGlob = Path.resolve(Path.join(rootPath, 'main/setup/roles/**/*.js'));

  // retrieve all available roles and its permissions defined inside /setup/roles directory
  const rolesDefinition = globSyncMultiple(rolesGlob);
  rolesDefinition.forEach((role) => {
    const roleObj = require(role);

    // merge current role to a single variable contains all roles
    availableRoles = {
      ...availableRoles,
      ...roleObj,
    };
  });

  // eslint-disable-next-line no-param-reassign
  server.plugins['package-acl'] = availableRoles;

  return next();
};

exports.register.attributes = {
  name: 'package-acl',
  version: '1.0.0',
};
