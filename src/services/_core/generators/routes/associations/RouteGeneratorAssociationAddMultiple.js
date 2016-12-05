import path from 'path';

const RouteGeneratorBaseAssociation = requireF('services/_core/generators/routes/base/RouteGeneratorBaseAssociation');
const HandlerGeneratorAssociationAddMultiple = requireF('services/_core/generators/handler/associations/HandlerGeneratorAssociationAddMultiple');

export default class RouteGeneratorAssociationAddMultiple extends RouteGeneratorBaseAssociation {
  constructor(model, association) {
    const methodName = 'associationAddMultiple';
    const handlerGenerator = new HandlerGeneratorAssociationAddMultiple(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'PUT';
    this.path = path.join(model.name, '{pk}', association.as, 'add');
  }
}
