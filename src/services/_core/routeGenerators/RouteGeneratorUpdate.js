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

    const singular = conf.get(`models:${model.name}:singular`) || model.name;

    this.method = 'POST';
    this.path = path.join(singular, '{id}');
  }
}
