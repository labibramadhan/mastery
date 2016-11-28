import glob from 'glob';
import path from 'path';

export default class BootConfigs {
  constructor(nconf) {
    this.nconf = nconf;
  }

  boot() {
    const self = this;
    const env = process.env.NODE_ENV || 'development';
    const configGlob = path.resolve(path.join(rootPath, 'config', '**', env, `${env}*.json`));
    const configs = glob.sync(configGlob);
    configs.forEach((config, idx) => {
      self.nconf.file(idx, config);
    });
  }
}
