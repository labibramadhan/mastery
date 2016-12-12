if (!isTest) {
  const HapiSwagger = require('hapi-swagger');
  const Inert = require('inert');
  const Vision = require('vision');

  const CombineObject = requireF('core/services/utility/CombineObject');

  const {
    Boot,
  } = requireF('core/services/EventsDecorator');

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

      const combineObject = new CombineObject();
      const combinedObject = combineObject.combine(hapiSwaggerConf, conf.get('swagger') || {});

      await server.register([
        Inert,
        Vision, {
          tags: ['api'],
          register: HapiSwagger,
          options: combinedObject,
        },
      ]);
    }
  }
}
