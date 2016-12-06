import path from 'path';

const BaseGeneralRoute = requireF('services/_core/generators/route/base/BaseGeneralRoute');
const FindByIdHandler = requireF('services/_core/generators/handler/FindByIdHandler');

export default class FindByIdRoute extends BaseGeneralRoute {
  constructor(model) {
    const methodName = 'findById';
    const handlerGenerator = new FindByIdHandler(model);

    super({
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'GET';
    this.path = path.join(model.name, '{pk}');
  }
}
