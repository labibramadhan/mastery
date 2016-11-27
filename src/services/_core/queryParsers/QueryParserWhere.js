import _ from 'lodash';

const SEQUELIZE_KEYS = ['include', 'order', 'limit', 'offset'];

export default class QueryParserWhere {
  parse = query => _.omit(_.omit(query, SEQUELIZE_KEYS), 'token')
}
