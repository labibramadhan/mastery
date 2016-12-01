import Boom from 'boom';

export default class HandlerGeneratorUpdate {
  constructor(model) {
    this.model = model;
  }

  handler = async (request, reply) => {
    try {
      const result = await this.model.findById(request.params.id);
      result.update(request.payload);
      return reply(result.toJSON());
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
