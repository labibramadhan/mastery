import Polyglot from 'node-polyglot';

export default class I18nWrapper extends Polyglot {
  getLocale = lang => lang || conf.get('defaultLocale')

  has(key, lang) {
    return super.has(`${this.getLocale(lang)}.${key}`);
  }

  t(key, options = {}, lang) {
    const locale = this.getLocale(lang);
    if (!this.has(key, locale)) return key;
    return super.t(`${locale}.${key}`, options);
  }
}
