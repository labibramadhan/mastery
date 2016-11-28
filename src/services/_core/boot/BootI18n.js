import glob from 'glob';
import path from 'path';

export default class BootI18n {
  constructor(polyglot) {
    this.polyglot = polyglot;
  }
  boot = () => {
    const localesGlob = path.resolve(path.join(rootPath, 'locales', '*.json'));
    const locales = glob.sync(localesGlob);
    locales.forEach((localePath) => {
      const locale = localePath.replace('.json', '');
      this.polyglot.locale(locale);
      this.polyglot.extend(require(localePath));
    });
    this.polyglot.locale(conf.get('defaultLocale'));
  }
}
