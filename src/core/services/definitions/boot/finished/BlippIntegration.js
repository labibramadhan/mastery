if (!isTest) {
  const HapiBlipp = require('blipp');

  const {
    Boot,
  } = requireF('core/services/EventsDecorator');

  @Boot('finished')
  class SwaggerIntegration { // eslint-disable-line no-unused-vars
    boot = async () => server.register(HapiBlipp);
  }
}
