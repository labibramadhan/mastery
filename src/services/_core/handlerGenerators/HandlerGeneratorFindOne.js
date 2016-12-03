import Boom from 'boom';

const HandlerErrorFormatter = requireF('services/_core/HandlerErrorFormatter');

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
   *
   * @memberOf HandlerGeneratorFindOne
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorFindOne
   */
  handler = async (request, reply) => {
    try {
      const result = await this.model.findOne(request.queryAPI);
      return reply(result.toJSON());
    } catch (e) {
      const handlerErrorFormatter = new HandlerErrorFormatter(request);
      return reply(Boom.badRequest(handlerErrorFormatter.format(e)));
    }
  }
}
