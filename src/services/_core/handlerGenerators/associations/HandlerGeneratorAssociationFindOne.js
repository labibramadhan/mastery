import _ from 'lodash';

const HandlerGeneratorBase = requireF('services/_core/handlerGenerators/HandlerGeneratorBase');

export default class HandlerGeneratorAssociationFindOne extends HandlerGeneratorBase {
  query = async (request, reply) => {
    const modelInstance = await this.model.findById(request.params.pk);
    const expectedMethodName = `get${_.upperFirst(_.camelCase(this.association.as))}`;
    const result = await modelInstance[expectedMethodName]();
    return reply(result.toJSON());
  }
}
