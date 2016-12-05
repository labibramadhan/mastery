import path from 'path';

const BaseAssociationRoute = requireF('services/_core/generators/route/base/BaseAssociationRoute');
const AddMultipleAssociationHandler = requireF('services/_core/generators/handler/associations/AddMultipleAssociationHandler');

export default class AddMultipleAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationAddMultiple';
    const handlerGenerator = new AddMultipleAssociationHandler(model, association);

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
