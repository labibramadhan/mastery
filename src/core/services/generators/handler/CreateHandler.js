const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class CreateHandler extends BaseHandler {
  query = async (request, reply) => {
    const result = await this.model.create(request.payload);
    return reply(result.toJSON());
  }
}
