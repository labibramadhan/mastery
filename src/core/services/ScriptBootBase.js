import _ from 'lodash';
import path from 'path';

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

export default class ScriptBootBase {
  constructor(hook = 'Before') {
    const hookName = _.capitalize(_.camelCase(hook));
    this.bootGlobs = [
      path.join(rootPath, 'core/setup/scripts/**', `*${hookName}.js`),
      path.join(rootPath, 'main/setup/scripts/**', `*${hookName}.js`),
    ];
  }

  boot = async () => {
    // retrieve all available boot scripts
    const bootFiles = globSyncMultiple(this.bootGlobs);
    for (const bootFile of bootFiles) { // eslint-disable-line no-restricted-syntax
      // execute the boot script
      await require(bootFile)();
    }
  }
}
