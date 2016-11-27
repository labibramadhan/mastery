import _ from 'lodash';
import Boom from 'boom';

const QueryParsers = requireF('services/_core/queryParsers/QueryParsers');

/**
 * Generate the count handler of an association of belongsToMany/hasMany
 *
 * @export
 * @class HandlerGeneratorAssociationCount
 */
export default class HandlerGeneratorAssociationCount {
  /**
   * Creates an instance of HandlerGeneratorAssociationCount.
   *
   * @param {Sequelize.Model} model
   * @param {string} componentId
   * @param {Sequelize.Model.Association} association
   *
   * @memberOf HandlerGeneratorAssociationCount
   */
  constructor(model, componentId, association) {
    this.model = model;
    this.componentId = componentId;
    this.association = association;
    this.permissions = [`${componentId}:${association.as}:count`];

    this.queryParsers = new QueryParsers();
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorAssociationCount
   */
  handler = async (request, reply) => {
    const {
      association,
      model,
      queryParsers,
    } = this;
    try {
      const modelInstance = await model.findById(request.params.id);
      if (!modelInstance) {
        return reply(Boom.notFound());
      }
      const methodName = `count${association.associationType}`;
      const queries = await queryParsers.parse(request, methodName);
      const expectedMethodName = `count${_.upperFirst(_.camelCase(association.as))}`;
      const result = await modelInstance[expectedMethodName](queries);
      return reply({ count: result });
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
