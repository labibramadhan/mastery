import path from 'path';

const RouteGeneratorBaseAssociation = requireF('services/_core/routeGenerators/base/RouteGeneratorBaseAssociation');
const HandlerGeneratorAssociationCount = requireF('services/_core/handlerGenerators/associations/HandlerGeneratorAssociationCount');

export default class RouteGeneratorAssociationFindAll extends RouteGeneratorBaseAssociation {
  constructor(model, association) {
    const methodName = 'countOneToMany';
    const methodAlias = 'count';
    const inherit = 'findById';
    const handlerGenerator = new HandlerGeneratorAssociationCount(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      inherit,
      methodAlias,
      methodName,
      model,
    });

    this.method = 'GET';
    this.path = path.join(model.name, '{pk}', association.as, 'count');
  }
}
