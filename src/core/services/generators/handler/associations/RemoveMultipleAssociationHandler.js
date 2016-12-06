import _ from 'lodash';

const BaseHandler = requireF('services/_core/generators/handler/BaseHandler');

export default class AddMultipleAssociationHandler extends BaseHandler {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const results = await modelInstance[this.association.accessors.addMultiple](request.payload);
    return reply(_.map(results[0], result => result.toJSON()));
  }
}
