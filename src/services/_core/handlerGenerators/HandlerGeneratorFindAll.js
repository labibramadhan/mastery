import Boom from 'boom';

const HandlerErrorFormatter = requireF('services/_core/HandlerErrorFormatter');

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
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorFindAll
   */
  handler = async (request, reply) => {
    try {
      const results = await this.model.findAll(request.queryAPI);
      return reply(results);
    } catch (e) {
      const handlerErrorFormatter = new HandlerErrorFormatter(request);
      return reply(Boom.badRequest(handlerErrorFormatter.format(e)));
    }
  }
}
