const RequestValidatorsAssociation = requireF('services/_core/requestValidators/RequestValidatorsAssociation');
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
    const requestValidators = new RequestValidatorsAssociation({
      association,
      model,
    });
    const validations = requestValidators.build({
      inherit,
      methodName,
    });

    super({
      handler,
      methodConf,
      model,
      validations,
    });

    this.permissions = [`${model.name}:${association.as}:${name}`, `${model.name}:own:${association.as}:${name}`, `${model.name}:own:${association.as}:own:${name}`];
    this.identifier = {
      name: methodName,
      inherit,
      association: association.as,
    };
  }
}
