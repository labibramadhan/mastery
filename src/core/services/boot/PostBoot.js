const HapiBlipp = require('blipp');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');

const {
  combineObject,
} = requireF('core/services/CommonServices');

export default class PostBoot {
  boot = async () => {
    if (!isTest) {
      const hapiSwaggerConf = {
        basePath: conf.get('prefix'),
        info: {
          title: conf.get('title'),
          version: pkg.version,
        },
      };

      combineObject(hapiSwaggerConf, conf.get('swagger') || {});

      server.register([
        Inert,
        Vision, {
          tags: ['api'],
          register: HapiSwagger,
          options: hapiSwaggerConf,
        },
        HapiBlipp,
      ]);
    }

    // start the server
    server.start(() => {
      // eslint-disable-next-line no-console
      console.log(`Server running at: ${server.info.uri}`);
    });
  }
}
