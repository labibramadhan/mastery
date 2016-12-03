import _ from 'lodash';

const RouteGeneratorBase = requireF('services/_core/routeGenerators/base/RouteGeneratorBase');

export default class RouteGeneratorBaseGeneral extends RouteGeneratorBase {
  constructor({
    handler,
    methodName,
    model,
  }) {
    const methodConf = conf.get(`models:${model.name}:methods:${methodName}`);

    super({
      handler,
      methodConf,
      model,
    });

    this.permissions = [`${model.name}:${methodName}`, `${model.name}:own:${methodName}`];

    _.set(this.identifier, 'name', methodName);
    _.set(this.identifier, 'preHandlerValidators', [`${model.name}.${methodName}`]);
    _.set(this.identifier, 'requestValidators', [`${model.name}.${methodName}`]);
  }
}
