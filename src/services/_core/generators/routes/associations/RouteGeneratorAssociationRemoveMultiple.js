import path from 'path';

const RouteGeneratorBaseAssociation = requireF('services/_core/generators/routes/base/RouteGeneratorBaseAssociation');
const HandlerGeneratorAssociationRemoveMultiple = requireF('services/_core/generators/handler/associations/HandlerGeneratorAssociationRemoveMultiple');

export default class RouteGeneratorAssociationRemoveMultiple extends RouteGeneratorBaseAssociation {
  constructor(model, association) {
    const methodName = 'associationRemoveMultiple';
    const handlerGenerator = new HandlerGeneratorAssociationRemoveMultiple(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'DELETE';
    this.path = path.join(model.name, '{pk}', association.as, 'remove');
  }
}
