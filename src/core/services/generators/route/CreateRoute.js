const BaseGeneralRoute = requireF('services/_core/generators/route/base/BaseGeneralRoute');
const CreateHandler = requireF('services/_core/generators/handler/CreateHandler');

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
