import path from 'path';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const LinkMultipleAssociationHandler = requireF('core/services/generators/handler/associations/LinkMultipleAssociationHandler');

export default class LinkMultipleAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationLinkMultiple';
    const handlerGenerator = new LinkMultipleAssociationHandler(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'PUT';
    this.path = path.join(model.name, '{pk}', association.as, 'link');
  }
}
