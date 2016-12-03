import Boom from 'boom';
import _ from 'lodash';

const HandlerErrorFormatter = requireF('services/_core/HandlerErrorFormatter');

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
      const modelInstance = await this.model.findById(request.params.pk);
      const expectedMethodName = `get${_.upperFirst(_.camelCase(this.association.as))}`;
      const results = await modelInstance[expectedMethodName](request.queryAPI);
      return reply(results);
    } catch (e) {
      const handlerErrorFormatter = new HandlerErrorFormatter(request);
      return reply(Boom.badRequest(handlerErrorFormatter.format(e)));
    }
  }
}
