import Path from 'path';
import _ from 'lodash';

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

export default class ScriptBootBase {
  constructor(hook = 'Before') {
    const hookName = _.capitalize(_.camelCase(hook));
    this.bootGlobs = [
      Path.join(rootPath, 'core/setup/scripts/**', `*${hookName}.js`),
      Path.join(rootPath, 'main/setup/scripts/**', `*${hookName}.js`),
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
