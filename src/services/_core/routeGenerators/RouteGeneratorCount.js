import path from 'path';

const RouteGeneratorBaseGeneral = requireF('services/_core/routeGenerators/base/RouteGeneratorBaseGeneral');
const HandlerGeneratorCount = requireF('services/_core/handlerGenerators/HandlerGeneratorCount');

export default class RouteGeneratorCount extends RouteGeneratorBaseGeneral {
  constructor(model) {
    const methodName = 'count';
    const handlerGenerator = new HandlerGeneratorCount(model);

    super({
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    const plural = conf.get(`models:${model.name}:plural`) || `${model.name}s`;

    this.method = 'GET';
    this.path = path.join(plural, methodName);
  }
}
