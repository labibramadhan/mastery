import _ from 'lodash';
import { applicableMethods } from './requestValidators';

// define all available query parameter except 'where'
const sequelizeKeys = ['include', 'order', 'limit', 'offset'];

export const parseWhere = (query) => {
  // because where object is not passed inside 'where' parameter, omit all parameters defined in sequelizeKeys variable
  const where = _.omit(_.omit(query, sequelizeKeys), 'token');

  Object.keys(where).forEach((key) => {
    try {
      // parse each where parameter value with JSON.parse() in case its value is an object
      where[key] = JSON.parse(where[key]);
    } catch (e) {
      //
    }
  });

  return where;
};

export const parseLimit = (query) => {
  const { limit } = query;
  if (!_.isUndefined(limit)) {
    // convert limit parameter value to number
    return _.toNumber(limit);
  }
  return 0;
};

export const parseOffset = (query) => {
  const { offset } = query;
  if (!_.isUndefined(offset)) {
    // convert offset parameter value to number
    return _.toNumber(offset);
  }
  return 0;
};

const parseOrderArray = (orderColumns, models) =>
  orderColumns.map((orderColumn) => {
    if (Array.isArray(orderColumn)) {
      return parseOrderArray(orderColumn, models);
    }

    let column;
    try {
      column = JSON.parse(orderColumn);
    } catch (e) {
      column = orderColumn;
    }

    if (column.model) column.model = models[column.model];

    return column;
  });

export const parseOrder = (request) => {
  const { order } = request.query;

  if (!order) return null;

  const models = request.getDb();
  if (models.isBoom) return models;

  const orderColumns = _.isString(order) ? [order.split(' ')] : order;

  return parseOrderArray(orderColumns, models);
};

const queryParsers = (request, methodName) => {
  let queries = {};

  // try to retrieve where parameters if exists
  if (_.indexOf(applicableMethods[methodName], 'where' > -1)) {
    const where = parseWhere(request.query);
    if (where) {
      queries = { ...queries, ...{ where } };
    }
  }

  // try to retrieve limit parameter if exists
  if (_.indexOf(applicableMethods[methodName], 'limit' > -1)) {
    const { limit } = parseLimit(request.query);
    if (limit) {
      queries = { ...queries, ...{ limit } };
    }
  }

  // try to retrieve offset parameter if exists
  if (_.indexOf(applicableMethods[methodName], 'offset' > -1)) {
    const { offset } = parseOffset(request.query);
    if (offset) {
      queries = { ...queries, ...{ offset } };
    }
  }
  return queries;
};

export default queryParsers;
