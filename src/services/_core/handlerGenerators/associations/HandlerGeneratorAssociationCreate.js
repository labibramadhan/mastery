const HandlerGeneratorBase = requireF('services/_core/handlerGenerators/HandlerGeneratorBase');

export default class HandlerGeneratorAssociationCreate extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const result = await modelInstance[this.association.accessors.create](request.payload);
    return reply(result.toJSON());
  }
}
