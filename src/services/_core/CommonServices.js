import _ from 'lodash';
import path from 'path';

export default class CommonServices {
  static requireF = file => require(path.join(rootPath, file));

  static getPackage = () => {
    const rootPath = path.resolve(path.join(__dirname, '..', '..', '..'));

    // return the contents of /package.json
    return require(path.join(rootPath, 'package.json'));
  };

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
}
