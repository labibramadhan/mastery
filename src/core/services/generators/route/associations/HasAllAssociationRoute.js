import Path from 'path';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const HasAllAssociationHandler = requireF('core/services/generators/handler/associations/HasAllAssociationHandler');

export default class HasAllAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationHasAll';
    const handlerGenerator = new HasAllAssociationHandler(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'POST';
    this.path = Path.join(model.name, '{pk}', association.as, 'has');
  }
}
