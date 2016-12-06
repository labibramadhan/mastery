import path from 'path';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const CountAssociationHandler = requireF('core/services/generators/handler/associations/CountAssociationHandler');

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
