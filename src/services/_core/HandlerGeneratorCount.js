import Boom from 'boom';

const queryParsers = requireF('services/_core/queryParsers').default;

export default class HandlerGeneratorCount {
  constructor(model, componentId) {
    this.model = model;
    this.componentId = componentId;
    this.permissions = [`${componentId}:count`];
  }

  handler = async (request, reply) => {
    const { model } = this;
    try {
      const queries = await queryParsers(request, 'count');
      const result = await model.count(queries);
      return reply({ count: result });
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
