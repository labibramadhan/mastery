require('babel-register');
require('../../src/setup/_core/globals');

process.setMaxListeners(0);

const Hapi = require('hapi');
const Promise = require('bluebird');
const portfinder = require('portfinder');
const HapiAuthJWT2 = require('hapi-auth-jwt2');

const getPort = Promise.promisify(portfinder.getPort);

const BootServer = requireF('services/_core/boot/BootServer');

export default async () => {
  const server = new Hapi.Server();
  global.server = server;

  const port = await getPort();
  server.connection({
    host: '0.0.0.0',
    port,
  });

  await server.register(HapiAuthJWT2);

  const bootServer = new BootServer();
  await bootServer.boot();
};
