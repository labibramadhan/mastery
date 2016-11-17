import path from 'path';
import glob from 'glob';

import { getPackage } from '../services/commonServices';

exports.register = async (server, options, next) => {
  let availableRoles = {};
  const rolesPath = path.resolve(path.join(__dirname, '..', 'setup', 'roles'));
  const rolesGlob = path.resolve(path.join(rolesPath, '**', '*.js'));

  // retrieve all available roles and its permissions defined inside /setup/roles directory
  const rolesDefinition = glob.sync(rolesGlob);
  rolesDefinition.forEach((role) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const roleObj = require(role);

    // merge current role to a single variable contains all roles
    availableRoles = { ...availableRoles, ...roleObj };
  });

  const JSONPackage = getPackage();

  // eslint-disable-next-line no-param-reassign
  server.plugins[`${JSONPackage.name}-acl`] = availableRoles;

  return next();
};

exports.register.attributes = {
  name: `${getPackage().name}-acl`,
  version: '1.0.0',
};
