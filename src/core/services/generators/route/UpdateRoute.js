import path from 'path';

const BaseGeneralRoute = requireF('core/services/generators/route/base/BaseGeneralRoute');
const UpdateHandler = requireF('core/services/generators/handler/UpdateHandler');

export default class UpdateRoute extends BaseGeneralRoute {
  constructor(model) {
    const methodName = 'update';
    const handlerGenerator = new UpdateHandler(model);

    super({
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'POST';
    this.path = path.join(model.name, '{pk}');
  }
}
