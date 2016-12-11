import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const {
  Startup,
} = requireF('core/services/EventsDecorator');

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

@Startup
export default class I18nBoot { // eslint-disable-line no-unused-vars
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
      i18n.extend(localesIndexed);
    }
    i18n.locale(conf.get('defaultLocale'));
  }
}
