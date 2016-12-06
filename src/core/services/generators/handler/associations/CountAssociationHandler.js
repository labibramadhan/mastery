const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class CountAssociationHandler extends BaseHandler {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const result = await modelInstance[this.association.accessors.count](request.queryAPI);
    return reply({
      count: result,
    });
  }
}
