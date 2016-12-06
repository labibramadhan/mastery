const I18nBoot = requireF('core/services/boot/I18nBoot');

export default class I18nWrapper {
  constructor(i18n) {
    if (!i18n) {
      const i18nBoot = new I18nBoot();
      this.i18n = i18nBoot.boot();
    }
  }

  getLocale = lang => lang || conf.get('defaultLocale')

  has = (key, lang) => this.i18n.has(`${this.getLocale(lang)}.${key}`)

  t(key, params = {}, lang) {
    const locale = this.getLocale(lang);
    if (!this.has(key, locale)) return key;
    return this.i18n.t(`${locale}.${key}`, params);
  }
}
