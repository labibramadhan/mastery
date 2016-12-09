const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class UnlinkAssociationHandler extends BaseHandler {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const result = await modelInstance[this.association.accessors.remove](request.params.pk2);
    return reply({ unlink: result });
  }
}
