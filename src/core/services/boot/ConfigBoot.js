import _ from 'lodash';
import fs from 'fs';
import nconf from 'nconf';
import path from 'path';

const ComponentConfigBoot = requireF('core/services/boot/ComponentConfigBoot');

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

export default class ConfigBoot {
  constructor() {
    nconf.use('memory');
    this.componentConfigBoot = new ComponentConfigBoot(nconf);
  }

  bootConfigFiles = (configs) => {
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
  }

  boot() {
    const defaultConfigGlob = path.join(rootPath, 'config/default/*');
    const defaultConfigs = globSyncMultiple(defaultConfigGlob);
    this.bootConfigFiles(defaultConfigs);

    const env = process.env.NODE_ENV || 'development';
    const configGlob = path.join(rootPath, 'config', env, '*');
    const configs = globSyncMultiple(configGlob);
    this.bootConfigFiles(configs);

    const componentGlobs = [
      path.join(rootPath, 'core/components/*'),
      path.join(rootPath, 'main/components/*'),
    ];
    const components = globSyncMultiple(componentGlobs);
    this.componentConfigBoot.boot(components);

    return nconf;
  }
}
