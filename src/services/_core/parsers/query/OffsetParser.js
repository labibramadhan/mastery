import _ from 'lodash';

export default class OffsetParser {
  parse = function parse(query) {
    const {
      offset,
    } = query;

    if (!_.isUndefined(offset)) {
      return _.toNumber(offset);
    }

    return 0;
  }
}
