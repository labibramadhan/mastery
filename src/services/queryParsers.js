import _ from 'lodash';
import Promise from 'bluebird';

import { applicableMethods } from './requestValidators';

// define all available query parameter except 'where'
const sequelizeKeys = ['include', 'order', 'limit', 'offset'];

const getIncludeModelInstance = (includeItem, models) => {
  return new Promise(async (resolve) => {
    let include = _.clone(includeItem);
    if (include) {
      if (typeof include !== 'object') {
        const singluarOrPluralMatch = Object.keys(models).find((modelName) => {
          const { _singular, _plural } = models[modelName];
          return _singular === include || _plural === include;
        });

        if (singluarOrPluralMatch) {
          return resolve(models[singluarOrPluralMatch]);
        }
      }

      if (typeof include === 'string' && models.hasOwnProperty(include)) {
        return resolve(models[include]);
      } else if (typeof include === 'object') {
        if (
          typeof include.model === 'string' &&
          include.model.length &&
          models.hasOwnProperty(include.model)
        ) {
          include.model = models[include.model];
        }
        if (include.hasOwnProperty('include')) {
          include.include = await getIncludeModelInstance(models, include.include);
          return resolve(include);
        } else {
          return resolve(include);
        }
      }
    }
    return resolve(include);
  });
};

export const parseInclude = async (query, models) => {
  if (typeof query.include === 'undefined') return [];

  const include = Array.isArray(query.include)
    ? query.include
    : [query.include];

  const includes = include.map(async (b) => {
    let a = b;
    try {
      a = JSON.parse(b);
    } catch (e) {
      //
    }

    return getIncludeModelInstance(a, models);
  }).filter(_.identity);

  return await Promise.all(includes);
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

const queryParsers = async (request, methodName) => {
  let queries = {};
  const { models } = request.server.plugins['hapi-sequelize'].db;

  // try to parse include parameters if exists
  if (applicableMethods[methodName].includes('include')) {
    const include = await parseInclude(request.query, models);
    if (include) {
      queries = { ...queries, ...{ include } };
    }
  }

  // try to parse where parameters if exists
  if (applicableMethods[methodName].includes('where')) {
    const where = parseWhere(request.query);
    if (where) {
      queries = { ...queries, ...{ where } };
    }
  }

  // try to parse limit parameter if exists
  if (applicableMethods[methodName].includes('limit')) {
    const { limit } = parseLimit(request.query);
    if (limit) {
      queries = { ...queries, ...{ limit } };
    }
  }

  // try to parse offset parameter if exists
  if (applicableMethods[methodName].includes('offset')) {
    const { offset } = parseOffset(request.query);
    if (offset) {
      queries = { ...queries, ...{ offset } };
    }
  }
  return queries;
};

export default queryParsers;
