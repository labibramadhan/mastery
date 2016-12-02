const RequestValidators = requireF('services/_core/requestValidators/RequestValidators');
const RouteGeneratorBase = requireF('services/_core/routeGenerators/base/RouteGeneratorBase');

export default class RouteGeneratorBaseGeneral extends RouteGeneratorBase {
  constructor({
    handler,
    methodName,
    model,
  }) {
    const methodConf = conf.get(`models:${model.name}:methods:${methodName}`);
    const requestValidators = new RequestValidators(model);
    const validations = requestValidators.build(methodName);

    super({
      handler,
      methodConf,
      model,
      validations,
    });

    this.permissions = [`${model.name}:${methodName}`, `${model.name}:own:${methodName}`];
    this.identifier = {
      name: methodName,
    };
  }
}
