import path from 'path';

const RouteGeneratorBaseAssociation = requireF('services/_core/generators/routes/base/RouteGeneratorBaseAssociation');
const HandlerGeneratorAssociationAdd = requireF('services/_core/generators/handler/associations/HandlerGeneratorAssociationAdd');

export default class RouteGeneratorAssociationAdd extends RouteGeneratorBaseAssociation {
  constructor(model, association) {
    const methodName = 'associationAdd';
    const handlerGenerator = new HandlerGeneratorAssociationAdd(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'PUT';
    this.path = path.join(model.name, '{pk}', association.as, 'add', '{pk2}');
  }
}
