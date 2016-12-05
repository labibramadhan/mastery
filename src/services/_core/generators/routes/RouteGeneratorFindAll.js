const RouteGeneratorBaseGeneral = requireF('services/_core/generators/routes/base/RouteGeneratorBaseGeneral');
const HandlerGeneratorFindAll = requireF('services/_core/generators/handler/HandlerGeneratorFindAll');

export default class RouteGeneratorFindAll extends RouteGeneratorBaseGeneral {
  constructor(model) {
    const methodName = 'findAll';
    const handlerGenerator = new HandlerGeneratorFindAll(model);

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
