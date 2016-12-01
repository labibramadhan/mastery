const RequestValidators = requireF('services/_core/requestValidators/RequestValidators');
const RouteGeneratorBase = requireF('services/_core/routeGenerators/base/RouteGeneratorBase');

export default class RouteGeneratorBaseAssociation extends RouteGeneratorBase {
  constructor({
    association,
    inherit,
    handler,
    methodName,
    methodAlias,
    model,
  }) {
    const name = methodAlias || methodName;
    const methodConf = conf.get(`models:${model.name}:methods:associations:${association.as}:${name}`);
    const requestValidators = new RequestValidators(model, association);

    super({
      handler,
      methodConf,
      methodName,
      model,
      requestValidators,
    });

    this.permissions = [`${model.name}:${association.as}:${name}`, `${model.name}:own:${association.as}:${name}`, `${model.name}:own:${association.as}:own:${name}`];
    this.identifier = {
      name: methodName,
      inherit,
      association: association.as,
    };
  }
}
