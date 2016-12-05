import path from 'path';

const RouteGeneratorBaseGeneral = requireF('services/_core/generators/routes/base/RouteGeneratorBaseGeneral');
const HandlerGeneratorDelete = requireF('services/_core/generators/handler/HandlerGeneratorDelete');

export default class RouteGeneratorDelete extends RouteGeneratorBaseGeneral {
  constructor(model) {
    const methodName = 'delete';
    const handlerGenerator = new HandlerGeneratorDelete(model);

    super({
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'DELETE';
    this.path = path.join(model.name, '{pk}');
  }
}
