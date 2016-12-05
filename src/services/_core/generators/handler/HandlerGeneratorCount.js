const HandlerGeneratorBase = requireF('services/_core/generators/handler/HandlerGeneratorBase');

export default class HandlerGeneratorCount extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const result = await this.model.count(request.queryAPI);
    return reply({
      count: result,
    });
  }
}
