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

  static combineObject = (source, obj, defaultMode = '@extend', parentKey = '') => {
    const indicators = /(@override|@delete)$/;
    _.forEach(obj, (o, key) => {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;

      let targetKeys = currentKey;
      let mode = defaultMode;

      const matches = currentKey.match(indicators);
      if (matches) {
        mode = matches[0];
        targetKeys = currentKey.substring(0, matches.index);
      }
      if (!_.has(source, targetKeys)) {
        _.set(source, targetKeys, o);
      } else {
        switch (mode) {
          case '@extend':
            {
              let targetValue;
              const obj1Value = _.clone(_.get(source, targetKeys));
              const obj2Value = _.clone(o);
              if (_.isObject(o)) {
                targetValue = _.merge(obj1Value, obj2Value);
              } else if (_.isArray(o)) {
                targetValue = _.union(_.concat(obj1Value, obj2Value));
              }
              _.set(source, targetKeys, targetValue);
              CommonServices.combineObject(source, o, defaultMode, targetKeys);
              break;
            }
          case '@override':
            {
              _.set(source, targetKeys, o);
              _.unset(source, targetKeys + mode);
              break;
            }
          case '@delete':
            {
              _.unset(source, targetKeys);
              _.unset(source, targetKeys + mode);
              break;
            }
        }
      }
    });
  };
}
