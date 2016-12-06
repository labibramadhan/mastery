const BaseGeneralRoute = requireF('core/services/generators/route/base/BaseGeneralRoute');
const FindAllHandler = requireF('core/services/generators/handler/FindAllHandler');

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
