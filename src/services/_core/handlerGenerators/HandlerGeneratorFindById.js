import Boom from 'boom';

/**
 * Generate the findById handler of a single model
 *
 * @export
 * @class HandlerGeneratorFindById
 */
export default class HandlerGeneratorFindById {
  /**
   * Creates an instance of HandlerGeneratorFindById.
   *
   * @param {Sequelize.Model} model
   * @param {string} componentId
   *
   * @memberOf HandlerGeneratorFindById
   */
  constructor(model, componentId) {
    this.model = model;
    this.componentId = componentId;
    this.permissions = [`${componentId}:findById`];
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorFindById
   */
  handler = async (request, reply) => {
    try {
      const result = await this.model.findById(request.params.id);
      if (!result) {
        return reply(Boom.notFound());
      }
      return reply(result.toJSON());
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
