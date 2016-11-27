import Boom from 'boom';

const QueryParsers = requireF('services/_core/queryParsers/QueryParsers');

/**
 * Generate the findAll handler of a single model
 *
 * @export
 * @class HandlerGeneratorFindAll
 */
export default class HandlerGeneratorFindAll {
  /**
   * Creates an instance of HandlerGeneratorFindAll.
   *
   * @param {Sequelize.Model} model
   * @param {string} componentId
   *
   * @memberOf HandlerGeneratorFindAll
   */
  constructor(model, componentId) {
    this.model = model;
    this.componentId = componentId;
    this.permissions = [`${componentId}:findAll`];

    this.queryParsers = new QueryParsers();
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorFindAll
   */
  handler = async (request, reply) => {
    try {
      const queries = await this.queryParsers.parse(request, 'findAll');
      const results = await this.model.findAll(queries);
      return reply(results);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
