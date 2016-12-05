import path from 'path';

const RouteGeneratorBaseAssociation = requireF('services/_core/generators/routes/base/RouteGeneratorBaseAssociation');
const HandlerGeneratorAssociationRemove = requireF('services/_core/generators/handler/associations/HandlerGeneratorAssociationRemove');

export default class RouteGeneratorAssociationRemove extends RouteGeneratorBaseAssociation {
  constructor(model, association) {
    const methodName = 'associationRemove';
    const handlerGenerator = new HandlerGeneratorAssociationRemove(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'DELETE';
    this.path = path.join(model.name, '{pk}', association.as, 'remove', '{pk2}');
  }
}
