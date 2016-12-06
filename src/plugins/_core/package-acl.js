import glob from 'glob';
import path from 'path';

exports.register = async (server, options, next) => {
  let availableRoles = {};
  const rolesGlob = path.resolve(path.join(rootPath, 'setup', 'roles', '**', '*.js'));

  // retrieve all available roles and its permissions defined inside /setup/roles directory
  const rolesDefinition = glob.sync(rolesGlob);
  rolesDefinition.forEach((role) => {
    const roleObj = require(role);

    // merge current role to a single variable contains all roles
    availableRoles = {
      ...availableRoles,
      ...roleObj,
    };
  });

  // eslint-disable-next-line no-param-reassign
  server.plugins[`${pkg.name}-acl`] = availableRoles;

  return next();
};

exports.register.attributes = {
  name: `${pkg.name}-acl`,
  version: '1.0.0',
};
