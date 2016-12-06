import path from 'path';

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

export default class ScriptBoot {
  boot = async (hook) => {
    const bootGlobs = [
      path.join(rootPath, 'core/setup/boot/**', `*${hook}.js`),
      path.join(rootPath, 'main/setup/boot/**', `*${hook}.js`),
    ];

    // retrieve all available boot scripts
    const bootFiles = globSyncMultiple(bootGlobs);
    for (const bootFile of bootFiles) { // eslint-disable-line no-restricted-syntax
      // execute the boot script
      await require(bootFile)();
    }
  }
}
