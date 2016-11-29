import _ from 'lodash';
import path from 'path';

const HandlerGeneratorCreate = requireF('services/_core/handlerGenerators/HandlerGeneratorCreate');
const RequestValidators = requireF('services/_core/requestValidators/RequestValidators');

const authStrategiesConfig = requireF('setup/config/authStrategiesConfig');

export default class RouteGeneratorCreate {
  constructor(model) {
    this.model = model;
    this.requestValidators = new RequestValidators(model);
    this.modelConf = conf.get(`models:${model.name}:methods:create`);
    this.authenticate = _.has(this.modelConf, 'authenticate') && this.modelConf.authenticate;
    this.singular = conf.get(`models:${model.name}:singular`) || model.name;
    this.prefix = conf.get('prefix');
    this.method = 'PUT';
    this.path = path.join(this.prefix, this.singular);
  }

  generate() {
    const options = {};
    const handlerCreate = new HandlerGeneratorCreate(this.model);

    _.set(options, 'method', this.method);
    _.set(options, 'path', this.path);
    _.set(options, 'handler', handlerCreate.handler);

    this.requestValidators.build();
    _.set(options, 'config.validate', this.requestValidators.create);

    if (this.authenticate) {
      _.set(options, 'config.auth.strategies', Object.keys(authStrategiesConfig));
      _.set(options, 'config.auth.scope', handlerCreate.permissions);
    }

    return options;
  }
}
