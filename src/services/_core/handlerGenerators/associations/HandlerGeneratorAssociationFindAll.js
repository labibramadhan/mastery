import _ from 'lodash';

const HandlerGeneratorBase = requireF('services/_core/handlerGenerators/HandlerGeneratorBase');

export default class HandlerGeneratorAssociationFindAll extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const results = await modelInstance[this.association.accessors.get](request.queryAPI);
    return reply(_.map(results, result => result.toJSON()));
  }
}
