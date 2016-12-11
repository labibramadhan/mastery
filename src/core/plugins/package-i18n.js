import AcceptLanguage from 'accept-language';
import Fs from 'fs';
import Path from 'path';
import _ from 'lodash';

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

const getAvailableLanguages = () => {
  const availableLanguages = [];
  const localesGlobs = [
    Path.join(rootPath, 'core/locales/*'),
    Path.join(rootPath, 'main/locales/*'),
  ];
  const locales = globSyncMultiple(localesGlobs);
  _.forEach(locales, (localePath) => {
    const localeName = Path.basename(localePath);
    if (Fs.lstatSync(localePath).isDirectory()) {
      availableLanguages.push(localeName);
    }
  });
  return _.union(availableLanguages);
};

exports.register = (server, options, next) => {
  AcceptLanguage.languages(getAvailableLanguages());

  const t = (request) => {
    let locale = conf.get('defaultLocale');
    if (_.has(request, 'headers.language')) {
      locale = request.headers.language;
    } else if (_.has(request, 'headers.[\'accept-language\']')) {
      locale = AcceptLanguage.get(request.headers['accept-language']);
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
