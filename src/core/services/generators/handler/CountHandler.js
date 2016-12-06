const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class CountHandler extends BaseHandler {
  query = async (request, reply) => {
    const result = await this.model.count(request.queryAPI);
    return reply({
      count: result,
    });
  }
}
