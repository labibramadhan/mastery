const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class CreateAssociationHandler extends BaseHandler {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const result = await modelInstance[this.association.accessors.create](request.payload);
    if (this.association.associationType === 'HasOne' || this.association.associationType === 'BelongsTo') {
      const relatedItem = await modelInstance[this.association.accessors.get]();
      return reply(relatedItem.toJSON());
    }
    return reply(result.toJSON());
  }
}
