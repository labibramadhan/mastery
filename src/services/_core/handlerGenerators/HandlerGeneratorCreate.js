import Boom from 'boom';

const HandlerErrorFormatter = requireF('services/_core/HandlerErrorFormatter');

/**
 * Generate the create handler of a single model
 *
 * @export
 * @class HandlerGeneratorCreate
 */
export default class HandlerGeneratorCreate {
  /**
   * Creates an instance of HandlerGeneratorCreate.
   *
   * @param {Sequelize.Model} model
   * @param {string} componentId
   *
   * @memberOf HandlerGeneratorCreate
   */
  constructor(model, componentId) {
    this.model = model;
    this.componentId = componentId;
    this.permissions = [`${componentId}:create`];
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorCreate
   */
  handler = async (request, reply) => {
    try {
      const result = await this.model.create(request.payload);
      return reply(result.toJSON());
    } catch (e) {
      const handlerErrorFormatter = new HandlerErrorFormatter(request);
      return reply(Boom.badRequest(handlerErrorFormatter.format(e)));
    }
  }
}
