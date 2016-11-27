import Boom from 'boom';

export default class HandlerGeneratorFindById {
  constructor(model, componentId) {
    this.model = model;
    this.componentId = componentId;
    this.permissions = [`${componentId}:findById`];
  }

  handler = async (request, reply) => {
    const { model } = this;
    try {
      const result = await model.findById(request.params.id) || Boom.notFound();
      return reply(result);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
