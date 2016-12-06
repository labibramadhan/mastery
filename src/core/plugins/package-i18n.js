import _ from 'lodash';
import acceptLanguage from 'accept-language';
import fs from 'fs';
import path from 'path';

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

const getAvailableLanguages = () => {
  const availableLanguages = [];
  const localesGlobs = [
    path.join(rootPath, 'locales', '*'),
    path.join(rootPath, 'locales', '_core', '*'),
  ];
  const locales = globSyncMultiple(localesGlobs);
  _.forEach(locales, (localePath) => {
    const localeName = path.basename(localePath);
    if (fs.lstatSync(localePath).isDirectory() && localeName !== '_core') {
      availableLanguages.push(localeName);
    }
  });
  return _.union(availableLanguages);
};

exports.register = (server, options, next) => {
  acceptLanguage.languages(getAvailableLanguages());

  const t = (request) => {
    let locale = conf.get('defaultLocale');
    if (_.has(request, 'headers.language')) {
      locale = request.headers.language;
    } else if (_.has(request, 'headers.[\'accept-language\']')) {
      locale = acceptLanguage.get(request.headers['accept-language']);
    }

    // eslint-disable-next-line no-param-reassign
    request.locale = locale;

    const func = (key, params = {}) => i18n.t(key, params, locale);
    func.has = key => i18n.has(key, locale);
    return func;
  };

  server.decorate('request', 't', t, {
    apply: true,
  });

  return next();
};

exports.register.attributes = {
  name: 'package-i18n',
  version: '1.0.0',
};
