const HandlerGeneratorBase = requireF('services/_core/handlerGenerators/HandlerGeneratorBase');

export default class HandlerGeneratorFindOne extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const result = await this.model.findOne(request.queryAPI);
    return reply(result.toJSON());
  }
}
