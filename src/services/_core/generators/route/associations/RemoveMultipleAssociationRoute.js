import path from 'path';

const BaseAssociationRoute = requireF('services/_core/generators/route/base/BaseAssociationRoute');
const RemoveMultipleAssociationHandler = requireF('services/_core/generators/handler/associations/RemoveMultipleAssociationHandler');

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
