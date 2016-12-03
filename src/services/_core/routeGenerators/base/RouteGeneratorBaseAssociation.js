import _ from 'lodash';

const RouteGeneratorBase = requireF('services/_core/routeGenerators/base/RouteGeneratorBase');

export default class RouteGeneratorBaseAssociation extends RouteGeneratorBase {
  constructor({
    association,
    handler,
    methodAlias,
    methodName,
    model,
  }) {
    const name = methodAlias || methodName;
    const methodConf = conf.get(`models:${model.name}:methods:associations:${association.as}:${name}`);

    super({
      handler,
      methodConf,
      model,
    });

    this.permissions = [`${model.name}:${association.as}:${name}`, `${model.name}:own:${association.as}:${name}`, `${model.name}:own:${association.as}:own:${name}`];

    _.set(this.identifier, 'name', methodName);
    _.set(this.identifier, 'preHandlerValidators', [`${model.name}.findById`, `${model.name}.${association.target.name}.${methodName}`]);
    _.set(this.identifier, 'requestValidators', [`${model.name}.findById`, `${association.target.name}.${methodName}`]);
  }
}
