import path from 'path';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const FindAllAssociationHandler = requireF('core/services/generators/handler/associations/FindAllAssociationHandler');

export default class FindAllAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationFindAll';
    const handlerGenerator = new FindAllAssociationHandler(model, association);

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
