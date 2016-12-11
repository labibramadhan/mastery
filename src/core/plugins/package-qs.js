import Qs from 'qs';
import Url from 'url';
import _ from 'lodash';

exports.register = (server, options, next) => {
  server.ext('onRequest', (request, reply) => {
    const uri = request.url;
    const parsed = Url.parse(uri, false);
    parsed.query = Qs.parse(parsed.query);
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
  name: 'package-qs',
  version: '1.0.0',
};
