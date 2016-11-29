import _ from 'lodash';
import path from 'path';

const HandlerGeneratorCount = requireF('services/_core/handlerGenerators/HandlerGeneratorCount');
const RequestValidators = requireF('services/_core/requestValidators/RequestValidators');

const authStrategiesConfig = requireF('setup/config/authStrategiesConfig');

export default class RouteGeneratorCount {
  constructor(model) {
    this.model = model;
    this.requestValidators = new RequestValidators(model);
    this.modelConf = conf.get(`models:${model.name}:methods:count`);
    this.authenticate = _.has(this.modelConf, 'authenticate') && this.modelConf.authenticate;
    this.plural = conf.get(`models:${model.name}:plural`) || `${model.name}s`;
    this.prefix = conf.get('prefix');
    this.method = 'GET';
    this.path = path.join(this.prefix, this.plural, 'count');
  }

  generate() {
    const options = {};
    const handlerCount = new HandlerGeneratorCount(this.model);

    _.set(options, 'method', this.method);
    _.set(options, 'path', this.path);
    _.set(options, 'handler', handlerCount.handler);

    this.requestValidators.build();
    _.set(options, 'config.validate', this.requestValidators.count);

    if (this.authenticate) {
      _.set(options, 'config.auth.strategies', Object.keys(authStrategiesConfig));
      _.set(options, 'config.auth.scope', handlerCount.permissions);
    }

    return options;
  }
}
