import path from 'path';
import Hapi from 'hapi';
import Sequelize from 'sequelize';
import * as HapiSequelize from 'hapi-sequelize';
import * as HapiAuthJWT2 from 'hapi-auth-jwt2';
import * as HapiBlipp from 'blipp';

import routesSetup from './setup/routes';
import { secret } from './setup/config';

const run = async () => {
  const server = new Hapi.Server();
  server.connection({ port: 4444, host: 'localhost' });

  const sequelize = new Sequelize('db', '', '', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: path.resolve(path.join(__dirname, '..', 'db.sqlite')),
  });

  await server.register({
    register: HapiSequelize,
    options: [
      {
        name: 'db',
        models: [path.join(__dirname, 'component/**/*Model.js')],
        sequelize,
        sync: true,
        forceSync: false,
      },
    ],
  });

  await server.register(HapiAuthJWT2);

  const validateAuth = (decoded, request, callback) =>
     callback(null, true, {
       scope: ['user:findAll', 'user:findOne', 'user:findById', 'user:count'],
       ...decoded,
     })
  ;

  server.auth.strategy('jwt', 'jwt', {
    key: secret,
    validateFunc: validateAuth,
    verifyOptions: { algorithms: ['HS256'] },
  });

  const allRoutes = await routesSetup(server.plugins['hapi-sequelize'].db.getModels());
  server.route(allRoutes);

  await server.register({
    register: HapiBlipp,
  });

  server.start(() => {
    // eslint-disable-next-line no-console
    console.log(`Server running at: ${server.info.uri}`);
  });
};

run();
