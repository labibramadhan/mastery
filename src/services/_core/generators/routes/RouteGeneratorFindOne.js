const RouteGeneratorBaseGeneral = requireF('services/_core/generators/routes/base/RouteGeneratorBaseGeneral');
const HandlerGeneratorFindOne = requireF('services/_core/generators/handler/HandlerGeneratorFindOne');

export default class RouteGeneratorFindOne extends RouteGeneratorBaseGeneral {
  constructor(model) {
    const methodName = 'findOne';
    const handlerGenerator = new HandlerGeneratorFindOne(model);

    super({
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'GET';
    this.path = model.name;
  }
}
