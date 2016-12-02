import path from 'path';

const RouteGeneratorBaseGeneral = requireF('services/_core/routeGenerators/base/RouteGeneratorBaseGeneral');
const HandlerGeneratorFindById = requireF('services/_core/handlerGenerators/HandlerGeneratorFindById');

export default class RouteGeneratorFindById extends RouteGeneratorBaseGeneral {
  constructor(model) {
    const methodName = 'findById';
    const handlerGenerator = new HandlerGeneratorFindById(model);

    super({
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    const singular = conf.get(`models:${model.name}:singular`) || model.name;

    this.method = 'GET';
    this.path = path.join(singular, '{pk}');
  }
}
