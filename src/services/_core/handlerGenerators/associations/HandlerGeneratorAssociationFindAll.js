import _ from 'lodash';
import Boom from 'boom';

const QueryParsers = requireF('services/_core/queryParsers/QueryParsers');

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
   * @param {Sequelize.Model.Association} association
   *
   * @memberOf HandlerGeneratorAssociationFindAll
   */
  constructor(model, association) {
    this.model = model;
    this.association = association;
    this.permissions = [`${model.name}:${association.as}:findAll`];

    this.queryParsers = new QueryParsers();
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorAssociationFindAll
   */
  handler = async (request, reply) => {
    try {
      const modelInstance = await this.model.findById(request.params.id);
      if (!modelInstance) {
        return reply(Boom.notFound());
      }
      const methodName = `findAll${this.association.associationType}`;
      const queries = await this.queryParsers.parse(request, methodName);
      const expectedMethodName = `get${_.upperFirst(_.camelCase(this.association.as))}`;
      const results = await modelInstance[expectedMethodName](queries);
      return reply(results);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
