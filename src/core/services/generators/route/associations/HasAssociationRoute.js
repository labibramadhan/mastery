import Path from 'path';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const HasAssociationHandler = requireF('core/services/generators/handler/associations/HasAssociationHandler');

export default class HasAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationHas';
    const handlerGenerator = new HasAssociationHandler(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'POST';
    this.path = Path.join(model.name, '{pk}', association.as, 'has', '{pk2}');
  }
}
