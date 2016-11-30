import Boom from 'boom';

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
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorCount
   */
  handler = async (request, reply) => {
    try {
      const result = await this.model.count(request.queryAPI);
      return reply({
        count: result,
      });
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
