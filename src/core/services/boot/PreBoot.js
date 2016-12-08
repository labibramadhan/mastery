import Hapi from 'hapi';

const HapiAuthJWT2 = require('hapi-auth-jwt2');

const portfinder = require('portfinder'); //eslint-disable-line
const Promise = require('bluebird');

const getPort = Promise.promisify(portfinder.getPort);

export default class PreBoot {
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
