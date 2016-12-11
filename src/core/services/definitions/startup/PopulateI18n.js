import Fs from 'fs';
import Path from 'path';
import _ from 'lodash';

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
      Path.join(rootPath, 'core/locales/*'),
      Path.join(rootPath, 'main/locales/*'),
    ];
    const locales = globSyncMultiple(localesGlobs);
    _.forEach(locales, (localePath) => {
      const localeName = Path.basename(localePath);
      if (Fs.lstatSync(localePath).isDirectory()) {
        const localeFilesGlob = Path.join(localePath, '*.json');
        const localeFiles = globSyncMultiple(localeFilesGlob);
        if (localeFiles.length) {
          if (!_.has(localesIndexed, localeName)) localesIndexed[localeName] = {};
          _.forEach(localeFiles, (localeFilePath) => {
            const localeCategoryName = Path.basename(localeFilePath).replace('.json', '').replace(`${localeName}-`, '');
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
