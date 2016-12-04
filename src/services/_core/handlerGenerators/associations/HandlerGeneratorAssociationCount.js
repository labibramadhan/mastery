const HandlerGeneratorBase = requireF('services/_core/handlerGenerators/HandlerGeneratorBase');

export default class HandlerGeneratorAssociationCount extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const result = await modelInstance[this.association.accessors.count](request.queryAPI);
    return reply({
      count: result,
    });
  }
}
