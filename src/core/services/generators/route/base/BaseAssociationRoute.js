import _ from 'lodash';

const BaseRoute = requireF('services/_core/generators/route/base/BaseRoute');

export default class BaseAssociationRoute extends BaseRoute {
  constructor({
    association,
    handler,
    methodName,
    model,
  }) {
    const methodNameKey = _.camelCase(methodName.replace('association', ''));
    const methodConf = conf.get(`models:${model.name}:methods:associations:${association.as}:${methodNameKey}`);

    super({
      handler,
      methodConf,
      model,
    });

    this.parsers = ['findById', methodName];
    this.permissions = [
      `${model.name}:${association.as}:${methodNameKey}`,
      `${model.name}:own:${association.as}:${methodNameKey}`,
      `${model.name}:own:${association.as}:own:${methodNameKey}`,
    ];
    this.requestValidators = [`${model.name}.findById`, `${association.target.name}.${methodName}`];

    _.set(this.identifier, 'preHandlerValidators', [`${model.name}.findById`, `${model.name}.${association.target.name}.${methodName}`]);
  }
}
