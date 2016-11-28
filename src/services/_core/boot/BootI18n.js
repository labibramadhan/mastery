import _ from 'lodash';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import Polyglot from 'node-polyglot';

export default class BootI18n {
  constructor() {
    this.polyglot = new Polyglot();
  }

  boot = () => {
    const localesIndexed = {};
    const localesGlob = path.resolve(path.join(rootPath, 'locales', '*'));
    const locales = glob.sync(localesGlob);
    _.forEach(locales, (localePath) => {
      if (fs.lstatSync(localePath).isDirectory()) {
        const localeName = path.basename(localePath);
        const localeFilesGlob = path.resolve(path.join(localePath, '*.json'));
        const localeFiles = glob.sync(localeFilesGlob);
        if (localeFiles.length) {
          localesIndexed[localeName] = {};
          _.forEach(localeFiles, (localeFilePath) => {
            const localeCategoryName = path.basename(localeFilePath).replace('.json', '').replace(`${localeName}-`, '');
            localesIndexed[localeName][localeCategoryName] = require(localeFilePath);
          });
        }
      }
    });
    if (_.size(localesIndexed) > 0) {
      this.polyglot.extend(localesIndexed);
    }
    this.polyglot.locale(conf.get('defaultLocale'));
    return this.polyglot;
  }
}
