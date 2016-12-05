import path from 'path';

const BaseAssociationRoute = requireF('services/_core/generators/route/base/BaseAssociationRoute');
const FindOneAssociationHandler = requireF('services/_core/generators/handler/associations/FindOneAssociationHandler');

export default class FindOneAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationFindOne';
    const handlerGenerator = new FindOneAssociationHandler(model, association);

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
