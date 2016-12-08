const HapiBlipp = require('blipp');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');

export default class PostBoot {
  boot = async () => {
    if (!isTest) {
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
    }

    // start the server
    server.start(() => {
      // eslint-disable-next-line no-console
      console.log(`Server running at: ${server.info.uri}`);
    });
  }
}
