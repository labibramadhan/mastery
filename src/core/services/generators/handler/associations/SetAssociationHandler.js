import HttpStatus from 'http-status-codes';

const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class SetAssociationHandler extends BaseHandler {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const result = await modelInstance[this.association.accessors.set](request.params.pk2);
    if (result) {
      return reply(modelInstance[this.association.accessors.get]());
    }
    return reply().code(HttpStatus.NOT_MODIFIED);
  }
}
