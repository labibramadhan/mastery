import _ from 'lodash';

export default class CombineObject {
  defaultMode = '@extend';
  indicators = /(@override|@delete)$/;

  process = (obj, parentKey = '') => {
    const self = this;
    _.forEach(obj, (o, key) => {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;

      let targetKeys = currentKey;
      let mode = self.defaultMode;

      const matches = currentKey.match(self.indicators);
      if (matches) {
        mode = matches[0];
        targetKeys = currentKey.substring(0, matches.index);
      }
      if (!_.has(self.output, targetKeys)) {
        _.set(self.output, targetKeys, o);
      } else {
        switch (mode) {
          case '@extend':
            {
              let targetValue;
              let iterate = true;
              const leftValue = _.clone(_.get(self.output, targetKeys));
              const rightValue = _.clone(o);
              if (_.isArray(leftValue)) {
                iterate = false;
                targetValue = _.union(_.concat(leftValue, rightValue));
              } else if (_.isObject(leftValue)) {
                // eslint-disable-next-line consistent-return
                targetValue = _.mergeWith(leftValue, rightValue, (leftVal, rightVal) => {
                  if (_.isArray(leftVal) && _.isArray(rightVal)) {
                    return _.union(leftVal.concat(rightVal));
                  }
                });
              } else {
                iterate = false;
                targetValue = rightValue;
              }
              _.set(self.output, targetKeys, targetValue);
              if (iterate) self.process(o, targetKeys);
              break;
            }
          case '@override':
            {
              _.set(self.output, targetKeys, o);
              _.unset(self.output, targetKeys + mode);
              break;
            }
          case '@delete':
            {
              _.unset(self.output, targetKeys);
              _.unset(self.output, targetKeys + mode);
              break;
            }
        }
      }
    });
  }

  combine = (source, obj) => {
    this.output = _.clone(source);
    this.process(obj);

    return this.output;
  }
}
