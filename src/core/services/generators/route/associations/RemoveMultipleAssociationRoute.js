import path from 'path';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const RemoveMultipleAssociationHandler = requireF('core/services/generators/handler/associations/RemoveMultipleAssociationHandler');

export default class RemoveMultipleAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationRemoveMultiple';
    const handlerGenerator = new RemoveMultipleAssociationHandler(model, association);

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
