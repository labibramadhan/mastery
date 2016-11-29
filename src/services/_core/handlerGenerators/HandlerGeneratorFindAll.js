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
   *
   * @memberOf HandlerGeneratorFindAll
   */
  constructor(model) {
    this.model = model;
    this.permissions = [`${model.name}:findAll`];

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
