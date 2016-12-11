import Path from 'path';

const BaseGeneralRoute = requireF('core/services/generators/route/base/BaseGeneralRoute');
const CountHandler = requireF('core/services/generators/handler/CountHandler');

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
    this.path = Path.join(plural, methodName);
  }
}
