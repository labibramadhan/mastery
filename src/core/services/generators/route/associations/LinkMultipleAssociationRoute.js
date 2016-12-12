import Path from 'path';

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

    this.method = 'LINK';
    this.path = Path.join(model.name, '{pk}', association.as, 'link');
  }
}
