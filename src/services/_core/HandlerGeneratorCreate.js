import Boom from 'boom';

export default class HandlerGeneratorCreate {
  constructor(model, componentId) {
    this.model = model;
    this.componentId = componentId;
    this.permissions = [`${componentId}:create`];
  }

  handler = async (request, reply) => {
    const { model } = this;
    try {
      const result = await model.create(request.payload);
      return reply(result);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
