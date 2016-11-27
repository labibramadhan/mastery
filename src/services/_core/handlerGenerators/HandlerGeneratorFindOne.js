import Boom from 'boom';

const queryParsers = requireF('services/_core/queryParsers').default;

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
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorFindOne
   */
  handler = async (request, reply) => {
    const { model } = this;
    try {
      const queries = await queryParsers(request, 'findOne');
      const result = await model.findOne(queries) || Boom.notFound();
      return reply(result);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
