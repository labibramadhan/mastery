import Hapi from 'hapi';

const HapiAuthJWT2 = require('hapi-auth-jwt2');

const portfinder = require('portfinder'); // eslint-disable-line import/no-extraneous-dependencies
const Promise = require('bluebird');

const getPort = Promise.promisify(portfinder.getPort);

const {
  Boot,
} = requireF('core/services/EventsDecorator');

@Boot('initialize')
class InitializeServer { // eslint-disable-line no-unused-vars
  boot = async () => {
    // initialize a HapiJS server
    const server = new Hapi.Server();
    global.server = server;

    server.connection({
      port: !isTest ? conf.get('port') : await getPort(),
      host: !isTest ? conf.get('host') : '0.0.0.0',
    });

    await server.register(HapiAuthJWT2);
  }
}
