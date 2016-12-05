const BaseGeneralRoute = requireF('services/_core/generators/route/base/BaseGeneralRoute');
const FindAllHandler = requireF('services/_core/generators/handler/FindAllHandler');

export default class FindAllRoute extends BaseGeneralRoute {
  constructor(model) {
    const methodName = 'findAll';
    const handlerGenerator = new FindAllHandler(model);

    super({
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    const plural = conf.get(`models:${model.name}:plural`) || `${model.name}s`;

    this.method = 'GET';
    this.path = plural;
  }
}
