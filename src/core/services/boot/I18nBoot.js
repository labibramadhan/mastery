import Polyglot from 'node-polyglot';
import _ from 'lodash';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

const {
  globSyncMultiple,
} = requireF('services/_core/CommonServices');

export default class I18nBoot {
  constructor() {
    this.polyglot = new Polyglot();
  }

  boot = () => {
    const localesIndexed = {};
    const localesGlobs = [
      path.join(rootPath, 'locales', '*'),
      path.join(rootPath, 'locales', '_core', '*'),
    ];
    const locales = globSyncMultiple(localesGlobs);
    _.forEach(locales, (localePath) => {
      const localeName = path.basename(localePath);
      if (fs.lstatSync(localePath).isDirectory() && localeName !== '_core') {
        const localeFilesGlob = path.resolve(path.join(localePath, '*.json'));
        const localeFiles = glob.sync(localeFilesGlob);
        if (localeFiles.length) {
          if (!_.has(localesIndexed, localeName)) localesIndexed[localeName] = {};
          _.forEach(localeFiles, (localeFilePath) => {
            const localeCategoryName = path.basename(localeFilePath).replace('.json', '').replace(`${localeName}-`, '');
            if (!_.has(localesIndexed[localeName], localeCategoryName)) {
              localesIndexed[localeName][localeCategoryName] = {};
            }
            _.merge(localesIndexed[localeName][localeCategoryName], require(localeFilePath));
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
