import _ from 'lodash';

const WhereParser = requireF('services/_core/parsers/query/WhereParser');
const IncludeParser = requireF('services/_core/parsers/query/IncludeParser');
const OrderParser = requireF('services/_core/parsers/query/OrderParser');
const LimitParser = requireF('services/_core/parsers/query/LimitParser');
const OffsetParser = requireF('services/_core/parsers/query/OffsetParser');

const ModelResolver = requireF('services/_core/resolvers/ModelResolver');

const modelResolver = new ModelResolver();
const models = modelResolver.getAllModels();
const whereParser = new WhereParser();
const includeParser = new IncludeParser(models);
const orderParser = new OrderParser(models);
const limitParser = new LimitParser();
const offsetParser = new OffsetParser();

const preHandlerQueryParser = async function preHandlerQueryParser(request, reply) {
  const tags = request.route.settings.tags;

  if (tags && tags.includes('generator') && _.has(request, 'route.settings.plugins.generator.queryParsers')) {
    let queries = {};
    const parsers = request.route.settings.plugins.generator.queryParsers;

    if (parsers.includes('where')) {
      const where = whereParser.parse(request.query);
      if (where && _.size(where) > 0) {
        queries = {
          ...queries,
          where,
        };
      }
    }

    if (parsers.includes('include')) {
      const include = await includeParser.parse(request.query);
      if (include && _.size(include) > 0) {
        queries = {
          ...queries,
          include,
        };
      }
    }

    if (parsers.includes('order')) {
      const order = orderParser.parse(request.query);
      if (order && _.size(order) > 0) {
        queries = {
          ...queries,
          order,
        };
      }
    }

    if (parsers.includes('limit')) {
      const limit = limitParser.parse(request.query);
      if (limit) {
        queries = {
          ...queries,
          limit,
        };
      }
    }

    if (parsers.includes('offset')) {
      const offset = offsetParser.parse(request.query);
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
  name: `${pkg.name}-pre-handler-query-parser`,
  version: '1.0.0',
};
