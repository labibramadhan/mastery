import path from 'path';

const {
  globSyncMultiple,
} = requireF('services/_core/CommonServices');

export default class BootScripts {
  boot = async (hook) => {
    const bootGlobs = [
      path.join(rootPath, 'setup', '_core', 'boot', '**', `*${hook}.js`),
      path.join(rootPath, 'setup', 'boot', '**', `*${hook}.js`),
    ];

    // retrieve all available boot scripts
    const bootFiles = globSyncMultiple(bootGlobs);
    for (const bootFile of bootFiles) { // eslint-disable-line no-restricted-syntax
      // execute the boot script
      await require(bootFile)();
    }
  }
}
