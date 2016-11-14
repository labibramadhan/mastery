import _ from 'lodash';

const sequelizeKeys = ['include', 'order', 'limit', 'offset'];

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
    throw new Error('`request.getDb` or `request.models` are not defined. Be sure to load hapi-sequelize before.');
  }

  const { models } = noGetDb ? request : request.getDb();

  return models;
};

export const parseWhere = (query) => {
  const where = _.omit(_.omit(query, sequelizeKeys), 'token');

  Object.keys(where).forEach((key) => {
    try {
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
    return _.toNumber(limit);
  }
  return 0;
};

export const parseOffset = (query) => {
  const { offset } = query;
  if (!_.isUndefined(offset)) {
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

export const parseQueries = (request, methodName) => {
  let queries = {};

  if (_.indexOf(methodQueries[methodName], 'where' > -1)) {
    const where = parseWhere(request.query);
    if (where) {
      queries = { ...queries, ...{ where } };
    }
  }

  if (_.indexOf(methodQueries[methodName], 'limit' > -1)) {
    const { limit } = parseLimit(request.query);
    if (limit) {
      queries = { ...queries, ...{ limit } };
    }
  }

  if (_.indexOf(methodQueries[methodName], 'offset' > -1)) {
    const { offset } = parseOffset(request.query);
    if (offset) {
      queries = { ...queries, ...{ offset } };
    }
  }
  return queries;
};
