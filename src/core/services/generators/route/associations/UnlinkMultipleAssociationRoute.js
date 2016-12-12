import Path from 'path';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const UnlinkMultipleAssociationHandler = requireF('core/services/generators/handler/associations/UnlinkMultipleAssociationHandler');

export default class UnlinkMultipleAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationUnlinkMultiple';
    const handlerGenerator = new UnlinkMultipleAssociationHandler(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'UNLINK';
    this.path = Path.join(model.name, '{pk}', association.as, 'unlink');
  }
}
