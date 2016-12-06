import _ from 'lodash';

const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class FindAllHandler extends BaseHandler {
  query = async (request, reply) => {
    const results = await this.model.findAll(request.queryAPI);
    return reply(_.map(results, result => result.toJSON()));
  }
}
