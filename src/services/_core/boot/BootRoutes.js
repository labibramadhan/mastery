import _ from 'lodash';
import glob from 'glob';
import path from 'path';

export default class BootRoutes {
  boot = async () => {
    // retrieve all available routes, pass all models from Sequelize as a single parameter
    const allRoutes = await this.resolveRoutes();
    server.route(allRoutes);
  }

  resolveRoutes = async () => {
    const routesGlob = path.resolve(path.join(rootPath, 'component', '**', '*Routes.js'));

    // retrieve all available routes from /component/**/*Routes.js
    const routesComponent = glob.sync(routesGlob);

    // merge all routes in an array
    const allRoutes = [];
    _.each(routesComponent, (filePath) => {
      const routes = require(filePath)();
      allRoutes.push(...routes);
    });

    return allRoutes;
  }
}
