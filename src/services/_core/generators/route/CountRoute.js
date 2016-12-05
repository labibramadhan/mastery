import path from 'path';

const BaseGeneralRoute = requireF('services/_core/generators/route/base/BaseGeneralRoute');
const CountHandler = requireF('services/_core/generators/handler/CountHandler');

export default class CountRoute extends BaseGeneralRoute {
  constructor(model) {
    const methodName = 'count';
    const handlerGenerator = new CountHandler(model);

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
