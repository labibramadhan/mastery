import path from 'path';
import Hapi from 'hapi';
import Sequelize from 'sequelize';
import * as HapiSequelize from 'hapi-sequelize';
import * as HapiAuthJWT2 from 'hapi-auth-jwt2';
import * as HapiBlipp from 'blipp';

import { secret, db } from './setup/config';
import { validateAuth } from './services/authentications';
import { bootServer } from './services/commonServices';

const run = async () => {
  // initialize a HapiJS server
  const server = new Hapi.Server();
  server.connection({ port: 4444, host: 'localhost' });

  // initialize a Sequelize instance
  const sequelize = new Sequelize('db', '', '', db);

  // register the hapi-sequelize plugin, let it scan /component/**/*Model.js for models
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

  // register the hapi-auth-jwt2 plugin
  await server.register(HapiAuthJWT2);

  // register the 'jwt' auth schema
  server.auth.strategy('jwt', 'jwt', {
    key: secret,
    validateFunc: validateAuth,
    verifyOptions: { algorithms: ['HS256'] },
  });

  // boot all available routes and execute boot scripts from /setup/boot directory
  await bootServer(server);

  // register Blipp for showing all available routes
  await server.register({
    register: HapiBlipp,
  });

  // start the server
  server.start(() => {
    // eslint-disable-next-line no-console
    console.log(`Server running at: ${server.info.uri}`);
  });
};

run();
