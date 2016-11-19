import url from 'url';
import qs from 'qs';

const { getPackage } = requireF('services/commonServices');

exports.register = (server, options, next) => {
  server.ext('onRequest', (request, reply) => {
    const uri = request.url;
    const parsed = url.parse(uri, false);
    parsed.query = qs.parse(parsed.query);
    request.setUrl(parsed);

    return reply.continue();
  });
  next();
};

exports.register.attributes = {
  name: `${getPackage().name}-qs`,
  version: '1.0.0',
};
