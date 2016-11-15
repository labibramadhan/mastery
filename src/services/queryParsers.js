import _ from 'lodash';

// define all available query parameter except 'where'
const sequelizeKeys = ['include', 'order', 'limit', 'offset'];

// define what parameters allowed each method
const methodQueries = {
  findAll: [
    'where',
    'include',
    'order',
    'limit',
    'offset',
  ],
  count: [
    'where',
    'include',
    'order',
    'limit',
    'offset',
  ],
  findOne: [
    'where',
    'include',
    'order',
    'offset',
  ],
  findById: [],
  create: [],
};

const getModels = (request) => {
  const noGetDb = typeof request.getDb !== 'function';
  const noRequestModels = !request.models;

  if (noGetDb && noRequestModels) {
    // throw if hapi-sequelize is not registered
    throw new Error('`request.getDb` or `request.models` are not defined. Be sure to load hapi-sequelize plugin.');
  }

  // get models instance from hapi-sequelize plugin
  const { models } = noGetDb ? request : request.getDb();

  return models;
};

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

const parseOrderArray = (order, models) =>
  order.map((requestColumn) => {
    if (Array.isArray(requestColumn)) {
      return parseOrderArray(requestColumn, models);
    }

    let column;
    try {
      column = JSON.parse(requestColumn);
    } catch (e) {
      column = requestColumn;
    }

    if (column.model) column.model = models[column.model];

    return column;
  });

export const parseOrder = (request) => {
  const { order } = request.query;

  if (!order) return null;

  const models = getModels(request);
  if (models.isBoom) return models;

  const requestOrderColumns = _.isString(order) ? [order.split(' ')] : order;

  return parseOrderArray(requestOrderColumns, models);
};

const queryParsers = (request, methodName) => {
  let queries = {};

  // try to retrieve where parameters if exists
  if (_.indexOf(methodQueries[methodName], 'where' > -1)) {
    const where = parseWhere(request.query);
    if (where) {
      queries = { ...queries, ...{ where } };
    }
  }

  // try to retrieve limit parameter if exists
  if (_.indexOf(methodQueries[methodName], 'limit' > -1)) {
    const { limit } = parseLimit(request.query);
    if (limit) {
      queries = { ...queries, ...{ limit } };
    }
  }

  // try to retrieve offset parameter if exists
  if (_.indexOf(methodQueries[methodName], 'offset' > -1)) {
    const { offset } = parseOffset(request.query);
    if (offset) {
      queries = { ...queries, ...{ offset } };
    }
  }
  return queries;
};

export default queryParsers;
