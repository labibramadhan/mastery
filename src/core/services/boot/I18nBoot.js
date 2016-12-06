import Polyglot from 'node-polyglot';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

export default class I18nBoot {
  constructor() {
    this.polyglot = new Polyglot();
  }

  boot = () => {
    const localesIndexed = {};
    const localesGlobs = [
      path.join(rootPath, 'core/locales/*'),
      path.join(rootPath, 'main/locales/*'),
    ];
    const locales = globSyncMultiple(localesGlobs);
    _.forEach(locales, (localePath) => {
      const localeName = path.basename(localePath);
      if (fs.lstatSync(localePath).isDirectory()) {
        const localeFilesGlob = path.join(localePath, '*.json');
        const localeFiles = globSyncMultiple(localeFilesGlob);
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
