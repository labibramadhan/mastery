const BaseGeneralRoute = requireF('services/_core/generators/route/base/BaseGeneralRoute');
const FindOneHandler = requireF('services/_core/generators/handler/FindOneHandler');

export default class FindOneRoute extends BaseGeneralRoute {
  constructor(model) {
    const methodName = 'findOne';
    const handlerGenerator = new FindOneHandler(model);

    super({
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'GET';
    this.path = model.name;
  }
}
