import Boom from 'boom';

export default class HandlerGeneratorUpdate {
  constructor(model, componentId) {
    this.model = model;
    this.componentId = componentId;
    this.permissions = [`${componentId}:update`];
  }

  handler = async (request, reply) => {
    try {
      const result = await this.model.findById(request.params.id);
      if (!result) {
        return reply(Boom.notFound());
      }
      result.update(request.payload);
      return reply(result.toJSON());
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
