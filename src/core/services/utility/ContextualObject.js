import _ from 'lodash';

export default class ContextualObject {
  constructor(filterProvider = {}) {
    this.filterProvider = filterProvider;
  }

  factoryProvider = (filterKey) => {
    switch (filterKey) {
      case 'env':
        return process.env.NODE_ENV;
    }
    return undefined;
  }

  processFilter = (defaultValue, obj, key, keys) => {
    let value = defaultValue;
    const filterKey = _.get(obj, '$filter');
    const filter = _.get(this.filterProvider, filterKey) || this.factoryProvider(filterKey);
    if (!_.isUndefined(filter)) {
      let filterValue = filter;
      if (_.isFunction(filter)) {
        filterValue = filter(obj, key, keys);
      }
      if (_.has(obj, filterValue)) {
        value = _.get(obj, filterValue);
      }
    }
    return value;
  }

  processObject = (obj, key, keys) => {
    let value = obj;
    if (_.has(obj, '$default')) {
      value = obj.$default;
      _.unset(obj, '$default');
    }
    if (_.has(obj, '$filter')) {
      value = this.processFilter(value, obj, key, keys);
      _.unset(obj, '$filter');
    }
    return value;
  }

  process(obj, parentKey = '') {
    const self = this;
    _.forEach(obj, (o, key) => {
      const keys = parentKey ? `${parentKey}.${key}` : key;
      if (_.isObject(o)) {
        if (_.has(o, '$default') || _.has(o, '$filter')) {
          const value = self.processObject(o, key, keys);
          _.set(obj, keys, value);
          self.process(obj, parentKey);
        } else {
          self.process(o, parentKey);
        }
      }
    });
  }

  parse(obj) {
    const objResult = _.clone(obj);
    this.process(objResult);

    return objResult;
  }
}
