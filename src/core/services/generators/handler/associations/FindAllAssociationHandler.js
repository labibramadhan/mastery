import _ from 'lodash';

const BaseHandler = requireF('services/_core/generators/handler/BaseHandler');

export default class FindAllAssociationHandler extends BaseHandler {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const results = await modelInstance[this.association.accessors.get](request.queryAPI);
    return reply(_.map(results, result => result.toJSON()));
  }
}
