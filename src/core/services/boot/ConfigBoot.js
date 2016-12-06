import _ from 'lodash';
import fs from 'fs';
import nconf from 'nconf';
import path from 'path';

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

export default class ConfigBoot {
  boot = function boot() {
    nconf.use('memory');
    const env = process.env.NODE_ENV || 'development';
    const configGlob = path.join(rootPath, 'config', env, '*');
    const configs = globSyncMultiple(configGlob);
    _.forEach(configs, (config, idx) => {
      if (fs.statSync(config).isDirectory()) {
        const groupName = path.basename(config);
        const groupConfigGlob = path.join(config, '*.json');
        const groupConfigs = globSyncMultiple(groupConfigGlob);
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
