import path from 'path';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const UnlinkAssociationHandler = requireF('core/services/generators/handler/associations/UnlinkAssociationHandler');

export default class UnlinkAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationUnlink';
    const handlerGenerator = new UnlinkAssociationHandler(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'DELETE';
    this.path = path.join(model.name, '{pk}', association.as, 'unlink', '{pk2}');
  }
}
