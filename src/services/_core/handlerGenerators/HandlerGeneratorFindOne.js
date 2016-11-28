import Boom from 'boom';

const QueryParsers = requireF('services/_core/queryParsers/QueryParsers');

/**
 * Generate the findOne handler of a single model
 *
 * @export
 * @class HandlerGeneratorFindOne
 */
export default class HandlerGeneratorFindOne {
  /**
   * Creates an instance of HandlerGeneratorFindOne.
   *
   * @param {Sequelize.Model} model
   * @param {string} componentId
   *
   * @memberOf HandlerGeneratorFindOne
   */
  constructor(model, componentId) {
    this.model = model;
    this.componentId = componentId;
    this.permissions = [`${componentId}:findOne`];

    this.queryParsers = new QueryParsers();
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorFindOne
   */
  handler = async (request, reply) => {
    try {
      const queries = await this.queryParsers.parse(request, 'findOne');
      const result = await this.model.findOne(queries);
      if (!result) {
        return reply(Boom.notFound());
      }
      return reply(result.toJSON());
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
