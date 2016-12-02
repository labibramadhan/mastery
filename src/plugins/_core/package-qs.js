import _ from 'lodash';
import qs from 'qs';
import url from 'url';

const {
  getPackage,
} = requireF('services/_core/CommonServices');

exports.register = (server, options, next) => {
  server.ext('onRequest', (request, reply) => {
    const uri = request.url;
    const parsed = url.parse(uri, false);
    parsed.query = qs.parse(parsed.query);
    parsed.query = _.forEach(parsed.query, (q, k) => {
      try {
        parsed.query[k] = JSON.parse(q);
      } catch (e) {
        if (_.isArray(parsed.query[k])) {
          _.forEach(parsed.query[k], (qc, kc) => {
            try {
              parsed.query[k][kc] = JSON.parse(qc);
            } catch (ec) {
              //
            }
          });
        }
      }
    });
    request.setUrl(parsed);

    return reply.continue();
  });
  next();
};

exports.register.attributes = {
  name: `${getPackage().name}-qs`,
  version: '1.0.0',
};
