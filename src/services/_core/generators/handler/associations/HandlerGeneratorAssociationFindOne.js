const HandlerGeneratorBase = requireF('services/_core/generators/handler/HandlerGeneratorBase');

export default class HandlerGeneratorAssociationFindOne extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const result = await modelInstance[this.association.accessors.get]();
    return reply(result.toJSON());
  }
}
