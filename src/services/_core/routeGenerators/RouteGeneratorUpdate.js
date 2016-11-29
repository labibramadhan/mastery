import _ from 'lodash';
import path from 'path';

const HandlerGeneratorUpdate = requireF('services/_core/handlerGenerators/HandlerGeneratorUpdate');
const RequestValidators = requireF('services/_core/requestValidators/RequestValidators');

const authStrategiesConfig = requireF('setup/config/authStrategiesConfig');

export default class RouteGeneratorUpdate {
  constructor(model) {
    this.model = model;
    this.requestValidators = new RequestValidators(model);
    this.modelConf = conf.get(`${model.name}:methods:update`);
    this.authenticate = _.has(this.modelConf, 'authenticate') && this.modelConf.authenticate;
    this.singular = conf.get(`${model.name}:singular`) || model.name;
    this.prefix = conf.get('prefix');
    this.method = 'POST';
    this.path = path.join(this.prefix, this.singular, '{id}');
  }

  generate() {
    const options = {};
    const handlerUpdate = new HandlerGeneratorUpdate(this.model);

    _.set(options, 'method', this.method);
    _.set(options, 'path', this.path);
    _.set(options, 'handler', handlerUpdate.handler);

    this.requestValidators.build();
    _.set(options, 'config.validate', this.requestValidators.update);

    if (this.authenticate) {
      _.set(options, 'config.auth.strategies', Object.keys(authStrategiesConfig));
      _.set(options, 'config.auth.scope', handlerUpdate.permissions);
    }

    return options;
  }
}
