import _ from 'lodash';
import Boom from 'boom';

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
      const expectedMethodName = `get${_.upperFirst(_.camelCase(this.association.as))}`;
      const results = await modelInstance[expectedMethodName](request.queryAPI);
      return reply(results);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  }
}
