import _ from 'lodash';
import Boom from 'boom';

const queryParsers = requireF('services/_core/queryParsers').default;

export default class HandlerGeneratorAssociationCount {
  constructor(model, componentId, association) {
    this.model = model;
    this.componentId = componentId;
    this.association = association;
    this.permissions = [`${componentId}:${association.as}:count`];
  }

  handler = async (request, reply) => {
    const {
      association,
      model,
    } = this;
    try {
      const modelInstance = await model.findById(request.params.id);
      if (!modelInstance) {
        return reply(Boom.notFound());
      }
      const methodName = `count${association.associationType}`;
      const queries = await queryParsers(request, methodName);
      const expectedMethodName = `count${_.upperFirst(_.camelCase(association.as))}`;
      const results = await modelInstance[expectedMethodName](queries);
      return reply(results);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
