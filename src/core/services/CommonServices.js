import _ from 'lodash';
import glob from 'glob';
import path from 'path';

export default class CommonServices {
  static requireF = (file: string) => require(path.join(rootPath, file));

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
      const files = glob.sync(pattern);
      results = _.concat(results, files);
    }
    return results;
  }
}
