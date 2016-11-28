import glob from 'glob';
import path from 'path';

export default class BootScripts {
  boot = async (hook) => {
    const bootGlob = path.resolve(path.join(rootPath, 'setup', 'boot', '**', `*${hook}.js`));

    // retrieve all available boot scripts
    const bootFiles = glob.sync(bootGlob);
    for (const bootFile of bootFiles) { // eslint-disable-line no-restricted-syntax
      // execute the boot script
      await require(bootFile)();
    }
  }
}
