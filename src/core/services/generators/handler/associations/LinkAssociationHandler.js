import HttpStatus from 'http-status-codes';
import _ from 'lodash';

const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class LinkAssociationHandler extends BaseHandler {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const results = await modelInstance[this.association.accessors.add](request.params.pk2);
    const result = _.map(results[0], instance => instance.toJSON());
    if (result.length) {
      return reply(result[0]);
    }
    return reply().code(HttpStatus.NOT_MODIFIED);
  }
}
