import _ from 'lodash';

const HandlerGeneratorBase = requireF('services/_core/handlerGenerators/HandlerGeneratorBase');

export default class HandlerGeneratorAssociationFindAll extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const expectedMethodName = `get${_.upperFirst(_.camelCase(this.association.as))}`;
    const results = await modelInstance[expectedMethodName](request.queryAPI);
    return reply(results);
  }
}
