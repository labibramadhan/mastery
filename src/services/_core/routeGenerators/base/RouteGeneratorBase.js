import _ from 'lodash';
import path from 'path';

const authStrategiesConfig = requireF('setup/config/authStrategiesConfig');

export default class RouteGeneratorBase {
  constructor({
    handler,
    methodConf,
    model,
    validations,
  }) {
    this.validations = validations;
    this.handler = handler;
    this.tags = ['api', 'generator', model.name];
    this.authenticate = _.has(methodConf, 'authenticate') && methodConf.authenticate;
  }

  generate() {
    const prefix = conf.get('prefix');
    const options = {};

    _.set(options, 'method', this.method);
    _.set(options, 'path', path.join(prefix, this.path));
    _.set(options, 'handler', this.handler);
    _.set(options, 'config.tags', this.tags);
    _.set(options, 'config.validate', this.validations);
    _.set(options, 'config.plugins.package', this.identifier);

    if (this.authenticate) {
      _.set(options, 'config.auth.strategies', Object.keys(authStrategiesConfig));
      _.set(options, 'config.auth.scope', this.permissions);
    }

    return options;
  }
}
