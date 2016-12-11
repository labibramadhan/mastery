import Path from 'path';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const FindOneAssociationHandler = requireF('core/services/generators/handler/associations/FindOneAssociationHandler');

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
    this.path = Path.join(model.name, '{pk}', association.as);
  }
}
