import Boom from 'boom';

const queryParsers = requireF('services/_core/queryParsers').default;

export default class HandlerGeneratorFindAll {
  constructor(model, componentId) {
    this.model = model;
    this.componentId = componentId;
    this.permissions = [`${componentId}:findAll`];
  }

  handler = async (request, reply) => {
    const { model } = this;
    try {
      const queries = await queryParsers(request, 'findAll');
      const results = await model.findAll(queries);
      return reply(results);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
