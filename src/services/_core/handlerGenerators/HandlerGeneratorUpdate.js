const HandlerGeneratorBase = requireF('services/_core/handlerGenerators/HandlerGeneratorBase');

export default class HandlerGeneratorUpdate extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const result = await this.model.findById(request.params.pk);
    result.update(request.payload);
    return reply(result.toJSON());
  }
}
