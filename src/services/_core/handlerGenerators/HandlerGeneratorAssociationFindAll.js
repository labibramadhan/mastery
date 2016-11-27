import _ from 'lodash';
import Boom from 'boom';

const queryParsers = requireF('services/_core/queryParsers').default;

/**
 * Generate the findAll handler of an association of belongsToMany/hasMany
 *
 * @export
 * @class HandlerGeneratorAssociationFindAll
 */
export default class HandlerGeneratorAssociationFindAll {
  /**
   * Creates an instance of HandlerGeneratorAssociationFindAll.
   *
   * @param {Sequelize.Model} model
   * @param {string} componentId
   * @param {Sequelize.Model.Association} association
   *
   * @memberOf HandlerGeneratorAssociationFindAll
   */
  constructor(model, componentId, association) {
    this.model = model;
    this.componentId = componentId;
    this.association = association;
    this.permissions = [`${componentId}:${association.as}:findAll`];
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorAssociationFindAll
   */
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
      const methodName = `findAll${association.associationType}`;
      const queries = await queryParsers(request, methodName);
      const expectedMethodName = `get${_.upperFirst(_.camelCase(association.as))}`;
      const results = await modelInstance[expectedMethodName](queries);
      return reply(results);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
