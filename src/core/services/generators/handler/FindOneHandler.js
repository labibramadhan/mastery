const BaseHandler = requireF('services/_core/generators/handler/BaseHandler');

export default class FindOneHandler extends BaseHandler {
  query = async (request, reply) => {
    const result = await this.model.findOne(request.queryAPI);
    return reply(result.toJSON());
  }
}
