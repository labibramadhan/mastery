const RequestValidatorConstants = requireF('services/_core/requestValidators/RequestValidatorConstants');

const QueryParserWhere = requireF('services/_core/queryParsers/QueryParserWhere');
const QueryParserInclude = requireF('services/_core/queryParsers/QueryParserInclude');
const QueryParserOrder = requireF('services/_core/queryParsers/QueryParserOrder');
const QueryParserLimit = requireF('services/_core/queryParsers/QueryParserLimit');
const QueryParserOffset = requireF('services/_core/queryParsers/QueryParserOffset');

const {
  getAllModels,
} = requireF('services/_core/commonServices');

export default class QueryParsers {
  constructor() {
    this.models = getAllModels();
    this.queryParserWhere = new QueryParserWhere();
    this.queryParserInclude = new QueryParserInclude(this.models);
    this.queryParserOrder = new QueryParserOrder(this.models);
    this.queryParserLimit = new QueryParserLimit();
    this.queryParserOffset = new QueryParserOffset();
  }
  parse = async function parse(request, methodName) {
    const {
      queryParserWhere,
      queryParserInclude,
      queryParserOrder,
      queryParserLimit,
      queryParserOffset,
    } = this;
    const {
      APPLICABLE_METHODS,
    } = RequestValidatorConstants;

    let queries = {};

    if (APPLICABLE_METHODS[methodName].includes('where')) {
      const where = queryParserWhere.parse(request.query);
      if (where) {
        queries = {
          ...queries,
          where,
        };
      }
    }

    if (APPLICABLE_METHODS[methodName].includes('include')) {
      const include = await queryParserInclude.parse(request.query);
      if (include) {
        queries = {
          ...queries,
          include,
        };
      }
    }

    if (APPLICABLE_METHODS[methodName].includes('order')) {
      const order = queryParserOrder.parse(request.query);
      if (order) {
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
    return queries;
  }
}
