import path from 'path';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const AddAssociationHandler = requireF('core/services/generators/handler/associations/AddAssociationHandler');

export default class AddAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationAdd';
    const handlerGenerator = new AddAssociationHandler(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'PUT';
    this.path = path.join(model.name, '{pk}', association.as, 'add', '{pk2}');
  }
}
