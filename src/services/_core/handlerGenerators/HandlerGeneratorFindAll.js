const HandlerGeneratorBase = requireF('services/_core/handlerGenerators/HandlerGeneratorBase');

export default class HandlerGeneratorFindAll extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const results = await this.model.findAll(request.queryAPI);
    return reply(results);
  }
}
