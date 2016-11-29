import _ from 'lodash';
import fs from 'fs';
import glob from 'glob';
import nconf from 'nconf';
import path from 'path';

export default class BootConfigs {
  boot = function boot() {
    nconf.use('memory');
    const env = process.env.NODE_ENV || 'development';
    const configGlob = path.resolve(path.join(rootPath, 'config', env, '*'));
    const configs = glob.sync(configGlob);
    _.forEach(configs, (config, idx) => {
      if (fs.statSync(config).isDirectory()) {
        const groupName = path.basename(config);
        const groupConfigGlob = path.join(config, '*.json');
        const groupConfigs = glob.sync(groupConfigGlob);
        if (groupConfigs.length) {
          nconf.set(groupName, {});
          _.forEach(groupConfigs, (groupConfig) => {
            const groupConfigObj = require(groupConfig);
            _.forEach(groupConfigObj, (groupConfigVal, groupConfigKey) => {
              nconf.set(`${groupName}:${groupConfigKey}`, groupConfigVal);
            });
          });
        }
      } else {
        nconf.file(idx, config);
      }
    });
    return nconf;
  }
}
