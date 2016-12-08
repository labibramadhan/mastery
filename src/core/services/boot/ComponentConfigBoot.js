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
        const configFilePath = path.join(componentPath, `${componentName}.config.json`);
        if (fs.existsSync(configFilePath)) {
          const config = require(configFilePath);
          const confKey = `models:${componentName}`;
          const existingConfig = self.nconf.get(confKey) || {};
          combineObject(existingConfig, config);
          self.nconf.set(confKey, existingConfig);
        }
      }
    }
  }
}
