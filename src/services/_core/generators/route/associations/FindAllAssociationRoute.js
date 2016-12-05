import path from 'path';

const BaseAssociationRoute = requireF('services/_core/generators/route/base/BaseAssociationRoute');
const FindAllAssociationHandler = requireF('services/_core/generators/handler/associations/FindAllAssociationHandler');

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
