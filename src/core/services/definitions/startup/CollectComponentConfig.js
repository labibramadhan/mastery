import Fs from 'fs';
import Path from 'path';
import _ from 'lodash';

const CombineObject = requireF('core/services/utility/CombineObject');

const {
  Startup,
} = requireF('core/services/EventsDecorator');

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

@Startup
class CollectComponentConfig { // eslint-disable-line no-unused-vars
  constructor() {
    this.componentGlobs = [
      Path.join(rootPath, 'core/components/*'),
      Path.join(rootPath, 'main/components/*'),
    ];
  }
  boot = () => {
    const combineObject = new CombineObject();
    const components = globSyncMultiple(this.componentGlobs);
    for (const componentPath of components) { // eslint-disable-line no-restricted-syntax
      if (Fs.lstatSync(componentPath).isDirectory()) {
        const componentName = Path.basename(componentPath);
        const configFiles = [];

        const configDefault = Path.join(componentPath, `${componentName}.config.json`);
        if (Fs.existsSync(configDefault)) {
          configFiles.push(configDefault);
        }

        if (isTest) {
          const configTest = Path.join(componentPath, `test/config/${componentName}.config.test.json`);
          if (Fs.existsSync(configTest)) {
            configFiles.push(configTest);
          }
        }

        if (configFiles.length) {
          const confKey = `models:${componentName}`;
          _.forEach(configFiles, (configFilePath) => {
            const config = require(configFilePath);
            const existingConfig = conf.get(confKey) || {};
            const combinedObject = combineObject.combine(existingConfig, config);
            conf.set(confKey, combinedObject);
          });
        }
      }
    }
  }
}
