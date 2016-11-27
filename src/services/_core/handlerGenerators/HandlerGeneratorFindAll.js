import Boom from 'boom';

const queryParsers = requireF('services/_core/queryParsers').default;

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
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorFindAll
   */
  handler = async (request, reply) => {
    const { model } = this;
    try {
      const queries = await queryParsers(request, 'findAll');
      const results = await model.findAll(queries);
      return reply(results);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
