import HttpStatus from 'http-status-codes';

const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

const {
  getResultInstances,
} = requireF('core/services/CommonServices');

export default class SetAllAssociationHandler extends BaseHandler {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const results = await modelInstance[this.association.accessors.set](request.payload);
    if (results && results.length) {
      return reply(getResultInstances(results));
    }
    return reply().code(HttpStatus.NOT_MODIFIED);
  }
}
