import Hapi from 'hapi';

import * as HapiAuthJWT2 from 'hapi-auth-jwt2';
import * as HapiBlipp from 'blipp';

process.setMaxListeners(0);

const run = async () => {
  // initialize a HapiJS server
  const server = new Hapi.Server();
  global.server = server;

  server.connection({
    port: 4444,
    host: 'localhost',
  });

  await server.register(HapiAuthJWT2);

  require('./setup/_core/globals');

  // boot the server
  const BootServer = requireF('services/_core/boot/BootServer');
  const bootServer = new BootServer();
  await bootServer.boot();

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
