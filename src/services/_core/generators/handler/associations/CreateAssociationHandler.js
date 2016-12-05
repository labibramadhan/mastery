const BaseHandler = requireF('services/_core/generators/handler/BaseHandler');

export default class CreateAssociationHandler extends BaseHandler {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const result = await modelInstance[this.association.accessors.create](request.payload);
    return reply(result.toJSON());
  }
}
