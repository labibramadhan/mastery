import Boom from 'boom';

const HandlerErrorFormatter = requireF('services/_core/HandlerErrorFormatter');

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
   *
   * @memberOf HandlerGeneratorFindById
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorFindById
   */
  handler = async (request, reply) => {
    try {
      const result = await this.model.findById(request.params.pk);
      return reply(result.toJSON());
    } catch (e) {
      const handlerErrorFormatter = new HandlerErrorFormatter(request);
      return reply(Boom.badRequest(handlerErrorFormatter.format(e)));
    }
  }
}
