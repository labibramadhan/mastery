import Boom from 'boom';
import HttpStatus from 'http-status-codes';

const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class HasAssociationHandler extends BaseHandler {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const result = await modelInstance[this.association.accessors.hasSingle](request.params.pk2);
    if (!result) {
      return reply(Boom.notFound());
    }
    return reply().code(HttpStatus.OK);
  }
}
