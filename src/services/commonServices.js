import glob from 'glob';
import path from 'path';

import routesSetup from '../setup/routes';

export const bootServer = async (server) => {
  // retrieve all available routes, pass the models from sequelize as a single parameter
  const allRoutes = await routesSetup(server.plugins['hapi-sequelize'].db.getModels());
  server.route(allRoutes);

  const bootPath = path.resolve(path.join(__dirname, '..', 'setup', 'boot'));
  const bootGlob = path.resolve(path.join(bootPath, '**', '*.js'));

  // retrieve all available boot scripts
  const bootFiles = glob.sync(bootGlob);
  for (const bootFile of bootFiles) {
    // execute the boot script
    await require(bootFile)(server);
  }
};

export const getAvailableRoles = () => {
  let availableRoles = {};
  const rolesPath = path.resolve(path.join(__dirname, '..', 'setup', 'roles'));
  const rolesGlob = path.resolve(path.join(rolesPath, '**', '*.js'));

  // retrieve all available roles and its permissions defined inside /setup/roles directory
  const rolesDefinition = glob.sync(rolesGlob);
  rolesDefinition.forEach((role) => {
    const roleObj = require(role);

    // merge current role to a single variable contains all roles
    availableRoles = { ...availableRoles, ...roleObj };
  });
  return availableRoles;
};
