import Boom from 'boom';

export default class HandlerGeneratorUpdate {
  constructor(model) {
    this.model = model;
    this.permissions = [`${model.name}:update`, `${model.name}:update:own`];
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
