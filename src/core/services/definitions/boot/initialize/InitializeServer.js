import Hapi from 'hapi';

const HapiAuthJWT2 = require('hapi-auth-jwt2');

const {
  Boot,
} = requireF('core/services/EventsDecorator');

@Boot('initialize')
class InitializeServer { // eslint-disable-line no-unused-vars
  boot = async () => {
    // initialize a HapiJS server
    const server = new Hapi.Server();
    global.server = server;

    let port = conf.get('port');

    if (isTest) {
      const Promise = require('bluebird');
      const portfinder = require('portfinder'); // eslint-disable-line import/no-extraneous-dependencies
      const getPort = Promise.promisify(portfinder.getPort);
      port = await getPort();
    }

    server.connection({
      port,
      host: !isTest ? conf.get('host') : '0.0.0.0',
    });

    await server.register(HapiAuthJWT2);
  }
}
