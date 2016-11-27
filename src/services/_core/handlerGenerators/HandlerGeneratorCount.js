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
   * @param {string} componentId
   *
   * @memberOf HandlerGeneratorCount
   */
  constructor(model, componentId) {
    this.model = model;
    this.componentId = componentId;
    this.permissions = [`${componentId}:count`];

    this.queryParsers = new QueryParsers();
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorCount
   */
  handler = async (request, reply) => {
    const {
      model,
      queryParsers,
    } = this;
    try {
      const queries = await queryParsers.parse(request, 'count');
      const result = await model.count(queries);
      return reply({
        count: result,
      });
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
