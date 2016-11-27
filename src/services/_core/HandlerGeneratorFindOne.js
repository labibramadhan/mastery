import Boom from 'boom';

const queryParsers = requireF('services/_core/queryParsers').default;

export default class HandlerGeneratorFindOne {
  constructor(model, componentId) {
    this.model = model;
    this.componentId = componentId;
    this.permissions = [`${componentId}:findOne`];
  }

  handler = async (request, reply) => {
    const { model } = this;
    try {
      const queries = await queryParsers(request, 'findOne');
      const result = await model.findOne(queries) || Boom.notFound();
      return reply(result);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
