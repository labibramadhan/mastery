const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class FindOneAssociationHandler extends BaseHandler {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const result = await modelInstance[this.association.accessors.get]();
    return reply(result.toJSON());
  }
}
