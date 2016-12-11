import Path from 'path';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const CreateAssociationHandler = requireF('core/services/generators/handler/associations/CreateAssociationHandler');

export default class CreateAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationCreate';
    const handlerGenerator = new CreateAssociationHandler(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'PUT';
    this.path = Path.join(model.name, '{pk}', association.as);
  }
}
