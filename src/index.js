import Hapi from 'hapi';
import Sequelize from 'sequelize';
import path from 'path';

import * as HapiAuthJWT2 from 'hapi-auth-jwt2';
import * as HapiBell from 'bell';
import * as HapiBlipp from 'blipp';
import * as HapiSequelize from 'hapi-sequelize';

import './setup/_core/globals';

const { db } = requireF('setup/config/commonConfigs');
const { bootServer } = requireF('services/_core/commonServices');

const run = async () => {
  // initialize a HapiJS server
  const server = new Hapi.Server();
  global.server = server;

  server.connection({ port: 4444, host: 'localhost' });

  // initialize a Sequelize instance
  const sequelize = new Sequelize('db', '', '', db);

  // register the hapi-sequelize plugin, let it scan /component/**/*Model.js for models
  const modelsGlob = path.resolve(path.join(rootPath, 'component', '**', '*Model.js'));
  const dbName = 'db';
  await server.register({
    register: HapiSequelize,
    options: [
      {
        name: dbName,
        models: [modelsGlob],
        sequelize,
        sync: true,
        forceSync: true,
        debug: true,
      },
    ],
  });

  // register the hapi-auth-jwt2 plugin
  await server.register([HapiAuthJWT2, HapiBell]);

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
