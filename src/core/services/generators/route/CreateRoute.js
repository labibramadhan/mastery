const BaseGeneralRoute = requireF('core/services/generators/route/base/BaseGeneralRoute');
const CreateHandler = requireF('core/services/generators/handler/CreateHandler');

export default class CreateRoute extends BaseGeneralRoute {
  constructor(model) {
    const methodName = 'create';
    const handlerGenerator = new CreateHandler(model);

    super({
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'PUT';
    this.path = model.name;
  }
}
