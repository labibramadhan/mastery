import _ from 'lodash';

export default class I18nExtended {
  constructor(request) {
    this.request = request;
    this.defaultLocale = this.locale = conf.get('defaultLocale');
    this.getRequestedLocale();
  }

  getRequestedLocale() {
    if (this.request) {
      if (_.has(this.request, 'headers[\'content-language\']')) {
        this.locale = this.request.headers['content-language'];
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
