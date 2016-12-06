import _ from 'lodash';

const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class RemoveAssociationHandler extends BaseHandler {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const results = await modelInstance[this.association.accessors.remove](request.params.pk2);
    return reply(_.map(results[0], result => result.toJSON()));
  }
}
