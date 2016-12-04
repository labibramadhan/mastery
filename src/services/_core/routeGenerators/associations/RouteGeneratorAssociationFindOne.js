import path from 'path';

const RouteGeneratorBaseAssociation = requireF('services/_core/routeGenerators/base/RouteGeneratorBaseAssociation');
const HandlerGeneratorAssociationFindOne = requireF('services/_core/handlerGenerators/associations/HandlerGeneratorAssociationFindOne');

export default class RouteGeneratorAssociationFindOne extends RouteGeneratorBaseAssociation {
  constructor(model, association) {
    const methodName = 'associationFindOne';
    const handlerGenerator = new HandlerGeneratorAssociationFindOne(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'GET';
    this.path = path.join(model.name, '{pk}', association.as);
  }
}
