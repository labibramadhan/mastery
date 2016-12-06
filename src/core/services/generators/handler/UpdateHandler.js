const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class UpdateHandler extends BaseHandler {
  query = async (request, reply) => {
    const result = await this.model.findById(request.params.pk);
    result.update(request.payload);
    return reply(result.toJSON());
  }
}
