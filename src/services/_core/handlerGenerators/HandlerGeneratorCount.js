import Boom from 'boom';

const HandlerErrorFormatter = requireF('services/_core/HandlerErrorFormatter');

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
      const handlerErrorFormatter = new HandlerErrorFormatter(request);
      return reply(Boom.badRequest(handlerErrorFormatter.format(e)));
    }
  }
}
