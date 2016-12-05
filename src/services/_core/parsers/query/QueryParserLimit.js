import _ from 'lodash';

export default class QueryParserLimit {
  parse = function parse(query) {
    const {
      limit,
    } = query;

    if (!_.isUndefined(limit)) {
      return _.toNumber(limit);
    }

    return 0;
  }
}
