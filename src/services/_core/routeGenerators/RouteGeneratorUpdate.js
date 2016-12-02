import path from 'path';

const RouteGeneratorBaseGeneral = requireF('services/_core/routeGenerators/base/RouteGeneratorBaseGeneral');
const HandlerGeneratorUpdate = requireF('services/_core/handlerGenerators/HandlerGeneratorUpdate');

export default class RouteGeneratorUpdate extends RouteGeneratorBaseGeneral {
  constructor(model) {
    const methodName = 'update';
    const handlerGenerator = new HandlerGeneratorUpdate(model);

    super({
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'POST';
    this.path = path.join(model.name, '{pk}');
  }
}
