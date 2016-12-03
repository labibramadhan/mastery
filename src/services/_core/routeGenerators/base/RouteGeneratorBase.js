import _ from 'lodash';
import path from 'path';

const RequestValidatorGenerator = requireF('services/_core/requestValidators/RequestValidatorGenerator');

const authStrategiesConfig = requireF('setup/config/authStrategiesConfig');

export default class RouteGeneratorBase {
  constructor({
    handler,
    methodConf,
    model,
  }) {
    this.identifier = {};
    this.handler = handler;
    this.tags = ['api', 'generator', model.name];
    this.authenticate = _.has(methodConf, 'authenticate') && methodConf.authenticate;
  }

  generate() {
    const prefix = conf.get('prefix');
    const options = {};

    if (_.has(this.identifier, 'requestValidators')) {
      const requestValidators = new RequestValidatorGenerator();
      const validators = requestValidators.buildMultiple(this.identifier.requestValidators);
      _.set(options, 'config.validate', validators);
    }

    _.set(options, 'method', this.method);
    _.set(options, 'path', path.join(prefix, this.path));
    _.set(options, 'handler', this.handler);
    _.set(options, 'config.tags', this.tags);
    _.set(options, 'config.plugins.generator', this.identifier);

    if (this.authenticate) {
      _.set(options, 'config.auth.strategies', Object.keys(authStrategiesConfig));
      _.set(options, 'config.auth.scope', this.permissions);
    }

    return options;
  }
}
