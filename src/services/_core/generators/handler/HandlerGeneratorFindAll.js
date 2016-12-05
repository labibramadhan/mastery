import _ from 'lodash';

const HandlerGeneratorBase = requireF('services/_core/generators/handler/HandlerGeneratorBase');

export default class HandlerGeneratorFindAll extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const results = await this.model.findAll(request.queryAPI);
    return reply(_.map(results, result => result.toJSON()));
  }
}
