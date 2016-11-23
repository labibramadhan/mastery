import path from 'path';
import portfinder from 'portfinder';
import Promise from 'bluebird';
import Hapi from 'hapi';
import Sequelize from 'sequelize';
import * as HapiAuthJWT2 from 'hapi-auth-jwt2';
import * as HapiBell from 'bell';
import * as HapiSequelize from 'hapi-sequelize';

import '../../src/setup/_core/globals';
import './globals';

const { bootServer } = requireF('services/_core/commonServices');

const getPort = Promise.promisify(portfinder.getPort);
const modelsGlob = path.resolve(path.join(rootPath, 'component', '**', '*Model.js'));
const dbName = 'db';

export default async (test) => {
  test.beforeEach('Get an open port', async (t) => {
    // eslint-disable-next-line no-param-reassign
    t.context.port = await getPort();
  });

  test.beforeEach('Setup server', async (t) => {
    // eslint-disable-next-line no-param-reassign
    const sequelize = t.context.sequelize = new Sequelize({
      dialect: 'sqlite',
      logging: false,
    });

    // eslint-disable-next-line no-param-reassign
    const server = t.context.server = new Hapi.Server();
    global.server = server;

    server.connection({
      host: '0.0.0.0',
      port: t.context.port,
    });

    await server.register({
      register: HapiSequelize,
      options: {
        name: dbName,
        models: [modelsGlob],
        sequelize,
        sync: true,
        forceSync: true,
      },
    });

    await server.register([HapiAuthJWT2, HapiBell]);

    await bootServer(server);
  });
};
