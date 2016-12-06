import _ from 'lodash';

const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class RemoveMultipleAssociationHandler extends BaseHandler {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const results = await modelInstance[this.association.accessors.removeMultiple](request.payload);
    return reply(_.map(results[0], result => result.toJSON()));
  }
}
