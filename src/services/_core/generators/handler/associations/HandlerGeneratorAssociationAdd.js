import _ from 'lodash';

const HandlerGeneratorBase = requireF('services/_core/generators/handler/HandlerGeneratorBase');

export default class HandlerGeneratorAssociationAdd extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const results = await modelInstance[this.association.accessors.add](request.params.pk2);
    return reply(_.map(results[0], result => result.toJSON()));
  }
}
