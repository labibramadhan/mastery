import Glob from 'glob';
import Path from 'path';
import Sequelize from 'sequelize';
import _ from 'lodash';

export default class CommonServices {
  static requireF = (file: string) => require(Path.join(rootPath, file));

  static requireAll = (pattern) => {
    const patternCollection = _.castArray(pattern);
    const patternFiles = CommonServices.globSyncMultiple(patternCollection);
    _.forEach(patternFiles, (patternFilePath) => {
      require(patternFilePath);
    });
  }

  static concatToJoiObject = (joiObject, candidate) => {
    if (!candidate) return joiObject;
    else if (candidate.isJoi) return joiObject.concat(candidate);
    return joiObject.keys(candidate);
  };

  static mergeJoiObject = (leftObject, rightObject, keys) => {
    const mergedObject = _.clone(leftObject);
    _.forEach(keys, (key) => {
      if (_.has(mergedObject, key) || _.has(rightObject, key)) {
        if (!_.has(mergedObject, key) && _.has(rightObject, key)) {
          _.set(mergedObject, key, rightObject[key]);
        } else if (_.has(mergedObject, key) && _.has(rightObject, key)) {
          _.set(
            mergedObject,
            key,
            CommonServices.concatToJoiObject(mergedObject[key], rightObject[key]),
          );
        }
      }
    });
    return mergedObject;
  };

  static globSyncMultiple = (patterns: Array) => {
    let results = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const pattern of _.castArray(patterns)) {
      const files = Glob.sync(pattern);
      results = _.concat(results, files);
    }
    return results;
  }

  static getResultInstances = (results) => {
    const returnValue = _.filter(results, (instances) => {
      if (_.isArray(instances)) {
        return _.filter(instances, (instance) => {
          if (instance instanceof Sequelize.Instance) {
            return instance.toJSON();
          }
          return false;
        });
      } else if (_.isObject(instances) && instances instanceof Sequelize.Instance) {
        return [instances];
      }
      return false;
    });
    return _.union(...returnValue);
  }
}
