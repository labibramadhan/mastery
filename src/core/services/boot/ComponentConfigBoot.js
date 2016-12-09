import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const {
  combineObject,
} = requireF('core/services/CommonServices');

export default class ComponentConfigBoot {
  constructor(nconf) {
    this.nconf = nconf;
  }

  boot = (components) => {
    const self = this;
    for (const componentPath of components) { // eslint-disable-line no-restricted-syntax
      if (fs.lstatSync(componentPath).isDirectory()) {
        const componentName = path.basename(componentPath);
        const configFiles = [];

        const configDefault = path.join(componentPath, `${componentName}.config.json`);
        if (fs.existsSync(configDefault)) {
          configFiles.push(configDefault);
        }

        if (isTest) {
          const configTest = path.join(componentPath, `test/config/${componentName}.config.test.json`);
          if (fs.existsSync(configTest)) {
            configFiles.push(configTest);
          }
        }

        if (configFiles.length) {
          const confKey = `models:${componentName}`;
          _.forEach(configFiles, (configFilePath) => {
            const config = require(configFilePath);
            const existingConfig = self.nconf.get(confKey) || {};
            combineObject(existingConfig, config);
            self.nconf.set(confKey, existingConfig);
          });
        }
      }
    }
  }
}
