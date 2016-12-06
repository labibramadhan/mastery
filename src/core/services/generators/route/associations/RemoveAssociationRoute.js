import path from 'path';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const RemoveAssociationHandler = requireF('core/services/generators/handler/associations/RemoveAssociationHandler');

export default class RemoveAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationRemove';
    const handlerGenerator = new RemoveAssociationHandler(model, association);

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
