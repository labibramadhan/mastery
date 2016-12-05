import _ from 'lodash';
import acceptLanguage from 'accept-language';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

const {
  getPackage,
} = requireF('services/_core/CommonServices');

const getAvailableLanguages = () => {
  const availableLanguages = [];
  const localesGlob = path.resolve(path.join(rootPath, 'locales', '*'));
  const locales = glob.sync(localesGlob);
  _.forEach(locales, (localePath) => {
    if (fs.lstatSync(localePath).isDirectory()) {
      const localeName = path.basename(localePath);
      availableLanguages.push(localeName);
    }
  });
  return availableLanguages;
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

    const has = key => i18n.has(`${locale}.${key}`);
    const func = (key, params = {}) => {
      if (!has(key)) return key;
      return i18n.t(`${locale}.${key}`, params);
    };
    func.has = has;
    return func;
  };
  server.decorate('request', 't', t, {
    apply: true,
  });

  return next();
};

exports.register.attributes = {
  name: `${getPackage().name}-i18n`,
  version: '1.0.0',
};
