const HandlerGeneratorBase = requireF('services/_core/handlerGenerators/HandlerGeneratorBase');

export default class HandlerGeneratorCount extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const result = await this.model.count(request.queryAPI);
    return reply({
      count: result,
    });
  }
}
