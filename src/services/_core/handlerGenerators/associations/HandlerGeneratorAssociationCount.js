import Boom from 'boom';
import _ from 'lodash';

const HandlerErrorFormatter = requireF('services/_core/HandlerErrorFormatter');

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
   * @param {Sequelize.Model.Association} association
   *
   * @memberOf HandlerGeneratorAssociationCount
   */
  constructor(model, association) {
    this.model = model;
    this.association = association;
  }

  /**
   * HapiJS route handler
   *
   * @memberOf HandlerGeneratorAssociationCount
   */
  handler = async (request, reply) => {
    try {
      const modelInstance = await this.model.findById(request.params.pk);
      const expectedMethodName = `count${_.upperFirst(_.camelCase(this.association.as))}`;
      const result = await modelInstance[expectedMethodName](request.queryAPI);
      return reply({ count: result });
    } catch (e) {
      const handlerErrorFormatter = new HandlerErrorFormatter(request);
      return reply(Boom.badRequest(handlerErrorFormatter.format(e)));
    }
  }
}
