import Hapi from 'hapi';

process.setMaxListeners(0);

const HapiAuthJWT2 = require('hapi-auth-jwt2');
const portfinder = require('portfinder');
const Promise = require('bluebird');

const getPort = Promise.promisify(portfinder.getPort);

require('../../src/core/setup/globals');

export default async () => {
  const server = new Hapi.Server();
  global.server = server;

  const port = await getPort();

  server.connection({
    host: '0.0.0.0',
    port,
  });

  await server.register(HapiAuthJWT2);

  const ServerBoot = requireF('core/services/boot/ServerBoot');
  const serverBoot = new ServerBoot();
  await serverBoot.boot();
};
