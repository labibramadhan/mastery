import Boom from 'boom';

const QueryParsers = requireF('services/_core/queryParsers/QueryParsers');

/**
 * Generate the count handler of a single model
 *
 * @export
 * @class HandlerGeneratorCount
 */
export default class HandlerGeneratorCount {
  /**
   * Creates an instance of HandlerGeneratorCount.
   *
   * @param {Sequelize.Model} model
   *
   * @memberOf HandlerGeneratorCount
   */
  constructor(model) {
    this.model = model;
    this.permissions = [`${model.name}:count`, `${model.name}:count:own`];

    this.queryParsers = new QueryParsers();
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorCount
   */
  handler = async (request, reply) => {
    try {
      const queries = await this.queryParsers.parse(request, 'count');
      const result = await this.model.count(queries);
      return reply({
        count: result,
      });
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
