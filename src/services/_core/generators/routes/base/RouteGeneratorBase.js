import _ from 'lodash';
import path from 'path';

const RequestValidatorConstants = requireF('services/_core/validators/request/RequestValidatorConstants');
const RequestValidatorGenerator = requireF('services/_core/validators/request/RequestValidatorGenerator');

const authStrategiesConfig = requireF('setup/config/authStrategiesConfig');

export default class RouteGeneratorBase {
  constructor({
    handler,
    model,
  }) {
    this.identifier = {};
    this.handler = handler;
    this.tags = ['api', 'generator', model.name];
  }

  generate() {
    const prefix = conf.get('prefix');
    const options = {};

    const {
      APPLICABLE_METHODS,
    } = RequestValidatorConstants;

    if (this.requestValidators) {
      const requestValidators = new RequestValidatorGenerator();
      const validators = requestValidators.buildMultiple(this.requestValidators);
      _.set(options, 'config.validate', validators);
    }

    _.set(options, 'method', this.method);
    _.set(options, 'path', path.join(prefix, this.path));
    _.set(options, 'handler', this.handler);
    _.set(options, 'config.tags', this.tags);
    _.set(options, 'config.plugins.generator', this.identifier);

    _.set(options, 'config.auth.strategies', Object.keys(authStrategiesConfig));
    _.set(options, 'config.auth.scope', this.permissions);

    const queryParsers = _.union(_.flatten(_.map(
      _.castArray(this.parsers), parser => APPLICABLE_METHODS[parser] || [],
    )));
    _.set(this.identifier, 'queryParsers', queryParsers);

    return options;
  }
}
