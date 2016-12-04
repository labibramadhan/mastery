const HandlerGeneratorBase = requireF('services/_core/handlerGenerators/HandlerGeneratorBase');

export default class HandlerGeneratorFindById extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const result = await this.model.findById(request.params.pk);
    return reply(result.toJSON());
  }
}
