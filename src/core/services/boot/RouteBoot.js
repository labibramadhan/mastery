import _ from 'lodash';
import path from 'path';

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

export default class RouteBoot {
  boot = async () => {
    // retrieve all available routes, pass all models from Sequelize as a single parameter
    const allRoutes = await this.resolveRoutes();
    server.route(allRoutes);
  };

  resolveRoutes = async () => {
    const routesGlobs = [
      path.join(rootPath, 'core/components/**/*Routes.js'),
      path.join(rootPath, 'main/components/**/*Routes.js'),
    ];

    // retrieve all available routes
    const routesComponent = globSyncMultiple(routesGlobs);

    // merge all routes in an array
    const allRoutes = [];
    _.each(routesComponent, (filePath) => {
      const routes = require(filePath)();
      allRoutes.push(...routes);
    });

    return allRoutes;
  }
}
