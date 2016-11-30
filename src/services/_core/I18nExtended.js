import _ from 'lodash';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import acceptLanguage from 'accept-language';

export default class I18nExtended {
  constructor(request) {
    this.request = request;
    this.defaultLocale = this.locale = conf.get('defaultLocale');
    acceptLanguage.languages(this.getAvailableLanguages());
    this.getRequestedLocale();
  }

  getAvailableLanguages = function getAvailableLanguages() {
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
  }

  getRequestedLocale() {
    if (this.request) {
      if (_.has(this.request, 'headers.language')) {
        this.locale = this.request.headers.language;
      } else if (_.has(this.request, 'headers.[\'accept-language\']')) {
        this.locale = acceptLanguage.get(this.request.headers['accept-language']);
      }
    }
  }

  has(key) {
    return i18n.has(`${this.locale}.${key}`);
  }

  t(key, params = {}) {
    return i18n.t(`${this.locale}.${key}`, params);
  }
}
