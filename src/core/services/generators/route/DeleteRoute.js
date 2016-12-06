import path from 'path';

const BaseGeneralRoute = requireF('core/services/generators/route/base/BaseGeneralRoute');
const DeleteHandler = requireF('core/services/generators/handler/DeleteHandler');

export default class DeleteRoute extends BaseGeneralRoute {
  constructor(model) {
    const methodName = 'delete';
    const handlerGenerator = new DeleteHandler(model);

    super({
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'DELETE';
    this.path = path.join(model.name, '{pk}');
  }
}
