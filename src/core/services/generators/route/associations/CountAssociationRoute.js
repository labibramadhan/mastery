import path from 'path';

const BaseAssociationRoute = requireF('services/_core/generators/route/base/BaseAssociationRoute');
const CountAssociationHandler = requireF('services/_core/generators/handler/associations/CountAssociationHandler');

export default class CountAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationCount';
    const handlerGenerator = new CountAssociationHandler(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'GET';
    this.path = path.join(model.name, '{pk}', association.as, 'count');
  }
}
