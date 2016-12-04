const HandlerGeneratorBase = requireF('services/_core/handlerGenerators/HandlerGeneratorBase');

export default class HandlerGeneratorCreate extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const result = await this.model.create(request.payload);
    return reply(result.toJSON());
  }
}
