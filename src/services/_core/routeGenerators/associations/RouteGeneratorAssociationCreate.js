import path from 'path';

const RouteGeneratorBaseAssociation = requireF('services/_core/routeGenerators/base/RouteGeneratorBaseAssociation');
const HandlerGeneratorAssociationCreate = requireF('services/_core/handlerGenerators/associations/HandlerGeneratorAssociationCreate');

export default class RouteGeneratorAssociationCreate extends RouteGeneratorBaseAssociation {
  constructor(model, association) {
    const methodName = 'associationCreate';
    const handlerGenerator = new HandlerGeneratorAssociationCreate(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'PUT';
    this.path = path.join(model.name, '{pk}', association.as);
  }
}
