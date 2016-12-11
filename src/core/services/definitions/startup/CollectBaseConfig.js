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
class CollectConfig { // eslint-disable-line no-unused-vars
  bootConfigFiles = (configs) => {
    _.forEach(configs, (config, idx) => {
      if (fs.statSync(config).isDirectory()) {
        const groupName = path.basename(config);
        const groupConfigGlob = path.join(config, '*.json');
        const groupConfigs = globSyncMultiple(groupConfigGlob);
        if (groupConfigs.length) {
          conf.set(groupName, {});
          _.forEach(groupConfigs, (groupConfig) => {
            const groupConfigObj = require(groupConfig);
            _.forEach(groupConfigObj, (groupConfigVal, groupConfigKey) => {
              conf.set(`${groupName}:${groupConfigKey}`, groupConfigVal);
            });
          });
        }
      } else {
        conf.file(idx, config);
      }
    });
  }

  boot = () => {
    conf.use('memory');

    const defaultConfigGlob = path.join(rootPath, 'config/default/*');
    const defaultConfigs = globSyncMultiple(defaultConfigGlob);
    this.bootConfigFiles(defaultConfigs);

    const env = process.env.NODE_ENV || 'development';
    const configGlob = path.join(rootPath, 'config', env, '*');
    const configs = globSyncMultiple(configGlob);
    this.bootConfigFiles(configs);
  }
}
