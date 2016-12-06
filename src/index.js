import Hapi from 'hapi';

const HapiAuthJWT2 = require('hapi-auth-jwt2');
const HapiBlipp = require('blipp');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');

process.setMaxListeners(0);

require('./core/setup/globals');

const run = async () => {
  // initialize a HapiJS server
  const server = new Hapi.Server();
  global.server = server;

  server.connection({
    port: conf.get('port'),
    host: conf.get('host'),
  });

  await server.register(HapiAuthJWT2);

  // boot the server
  const ServerBoot = requireF('core/services/boot/ServerBoot');
  const serverBoot = new ServerBoot();
  await serverBoot.boot();

  server.register([
    Inert,
    Vision, {
      tags: ['api'],
      register: HapiSwagger,
      options: {
        basePath: conf.get('prefix'),
        info: {
          title: conf.get('title'),
          version: pkg.version,
        },
      },
    },
    HapiBlipp,
  ]);

  // start the server
  server.start(() => {
    // eslint-disable-next-line no-console
    console.log(`Server running at: ${server.info.uri}`);
  });
};

run();
