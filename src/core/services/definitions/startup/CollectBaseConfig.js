import Fs from 'fs';
import Path from 'path';
import _ from 'lodash';

const CombineObject = requireF('core/services/utility/CombineObject');
const ContextualObject = requireF('core/services/utility/ContextualObject');

const {
  Startup,
} = requireF('core/services/EventsDecorator');

const {
  globSyncMultiple,
} = requireF('core/services/CommonServices');

@Startup
class CollectConfig { // eslint-disable-line no-unused-vars
  bootConfigFiles = (configPaths) => {
    let configMaster = {};
    const combineObject = new CombineObject();
    const contextualObject = new ContextualObject();
    _.forEach(configPaths, (configPath) => {
      if (Fs.statSync(configPath).isDirectory()) {
        const groupName = Path.basename(configPath);
        const groupConfigGlob = Path.join(configPath, '*.json');
        const groupConfigs = globSyncMultiple(groupConfigGlob);
        if (groupConfigs.length) {
          _.forEach(groupConfigs, (groupConfig) => {
            const groupConfigObj = require(groupConfig);
            configMaster = combineObject.combine(configMaster, {
              [groupName]: groupConfigObj,
            });
            configMaster = contextualObject.parse(configMaster);
          });
        }
      } else {
        const configObj = require(configPath);
        configMaster = combineObject.combine(configMaster, configObj);
        configMaster = contextualObject.parse(configMaster);
      }
    });
    conf.defaults(configMaster);
  }

  boot = () => {
    conf.use('memory');

    const configGlob = Path.join(rootPath, 'config/*');
    const configPaths = globSyncMultiple(configGlob);
    this.bootConfigFiles(configPaths);
  }
}
