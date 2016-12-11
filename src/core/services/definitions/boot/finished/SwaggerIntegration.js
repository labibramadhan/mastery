if (!isTest) {
  const HapiSwagger = require('hapi-swagger');
  const Inert = require('inert');
  const Vision = require('vision');

  const {
    Boot,
  } = requireF('core/services/EventsDecorator');

  const {
    combineObject,
  } = requireF('core/services/CommonServices');

  @Boot('finished')
  class SwaggerIntegration { // eslint-disable-line no-unused-vars
    boot = async () => {
      const hapiSwaggerConf = {
        basePath: conf.get('prefix'),
        info: {
          title: conf.get('title'),
          version: pkg.version,
        },
      };

      combineObject(hapiSwaggerConf, conf.get('swagger') || {});

      await server.register([
        Inert,
        Vision, {
          tags: ['api'],
          register: HapiSwagger,
          options: hapiSwaggerConf,
        },
      ]);
    }
  }
}
