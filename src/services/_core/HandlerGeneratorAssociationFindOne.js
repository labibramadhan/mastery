import _ from 'lodash';
import Boom from 'boom';

export default class HandlerGeneratorAssociationFindOne {
  constructor(model, componentId, association) {
    this.model = model;
    this.componentId = componentId;
    this.association = association;
    this.permissions = [`${componentId}:${association.as}:findOne`];
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
      const expectedMethodName = `get${_.upperFirst(_.camelCase(association.as))}`;
      const result = await modelInstance[expectedMethodName]();
      return reply(result);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
