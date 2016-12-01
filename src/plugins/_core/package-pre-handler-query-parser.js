import _ from 'lodash';

const {
  getPackage,
} = requireF('services/_core/commonServices');

const RequestValidatorConstants = requireF('services/_core/requestValidators/RequestValidatorConstants');

const QueryParserWhere = requireF('services/_core/queryParsers/QueryParserWhere');
const QueryParserInclude = requireF('services/_core/queryParsers/QueryParserInclude');
const QueryParserOrder = requireF('services/_core/queryParsers/QueryParserOrder');
const QueryParserLimit = requireF('services/_core/queryParsers/QueryParserLimit');
const QueryParserOffset = requireF('services/_core/queryParsers/QueryParserOffset');

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

const resolverModels = new ResolverModels();
const models = resolverModels.getAllModels();
const queryParserWhere = new QueryParserWhere();
const queryParserInclude = new QueryParserInclude(models);
const queryParserOrder = new QueryParserOrder(models);
const queryParserLimit = new QueryParserLimit();
const queryParserOffset = new QueryParserOffset();

const {
  APPLICABLE_METHODS,
} = RequestValidatorConstants;

const preHandlerQueryParser = async function preHandlerQueryParser(request, reply) {
  const tags = request.route.settings.tags;

  if (tags && tags.includes('generator')) {
    let queries = {};
    const methodName = request.route.settings.plugins.package.name;

    if (APPLICABLE_METHODS[methodName].includes('where')) {
      const where = queryParserWhere.parse(request.query);
      if (where && _.size(where) > 0) {
        queries = {
          ...queries,
          where,
        };
      }
    }

    if (APPLICABLE_METHODS[methodName].includes('include')) {
      const include = await queryParserInclude.parse(request.query);
      if (include && _.size(include) > 0) {
        queries = {
          ...queries,
          include,
        };
      }
    }

    if (APPLICABLE_METHODS[methodName].includes('order')) {
      const order = queryParserOrder.parse(request.query);
      if (order && _.size(order) > 0) {
        queries = {
          ...queries,
          order,
        };
      }
    }

    if (APPLICABLE_METHODS[methodName].includes('limit')) {
      const limit = queryParserLimit.parse(request.query);
      if (limit) {
        queries = {
          ...queries,
          limit,
        };
      }
    }

    if (APPLICABLE_METHODS[methodName].includes('offset')) {
      const offset = queryParserOffset.parse(request.query);
      if (offset) {
        queries = {
          ...queries,
          offset,
        };
      }
    }

    // eslint-disable-next-line no-param-reassign
    request.queryAPI = queries;
  }
  return reply.continue();
};

exports.register = async (server, options, next) => {
  server.ext('onPreHandler', preHandlerQueryParser);
  return next();
};

exports.register.attributes = {
  name: `${getPackage().name}-pre-handler-query-parser`,
  version: '1.0.0',
};
