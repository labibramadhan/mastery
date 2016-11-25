import path from 'path';
import glob from 'glob';
import _ from 'lodash';

export default async (models) => {
  const routesGlob = path.resolve(path.join(rootPath, 'component', '**', '*Routes.js'));

  // retrieve all available routes from /component/**/*Routes.js
  const routesComponent = glob.sync(routesGlob);

  // merge all routes in an array
  const allRoutes = [];
  _.each(routesComponent, (filePath) => {
    const routes = require(filePath)(models);
    allRoutes.push(...routes);
  });

  return allRoutes;
};
