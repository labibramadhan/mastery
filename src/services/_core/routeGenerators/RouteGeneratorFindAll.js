import _ from 'lodash';
import path from 'path';

const HandlerGeneratorFindAll = requireF('services/_core/handlerGenerators/HandlerGeneratorFindAll');
const RequestValidators = requireF('services/_core/requestValidators/RequestValidators');

const authStrategiesConfig = requireF('setup/config/authStrategiesConfig');

export default class RouteGeneratorFindAll {
  constructor(model) {
    this.model = model;
    this.requestValidators = new RequestValidators(model);
    this.modelConf = conf.get(`${model.name}:methods:findAll`);
    this.authenticate = _.has(this.modelConf, 'authenticate') && this.modelConf.authenticate;
    this.plural = conf.get(`${model.name}:plural`) || `${model.name}s`;
    this.prefix = conf.get('prefix');
    this.method = 'GET';
    this.path = path.join(this.prefix, this.plural);
  }

  generate() {
    const options = {};
    const handlerFindAll = new HandlerGeneratorFindAll(this.model);

    _.set(options, 'method', this.method);
    _.set(options, 'path', this.path);
    _.set(options, 'handler', handlerFindAll.handler);

    this.requestValidators.build();
    _.set(options, 'config.validate', this.requestValidators.findAll);

    if (this.authenticate) {
      _.set(options, 'config.auth.strategies', Object.keys(authStrategiesConfig));
      _.set(options, 'config.auth.scope', handlerFindAll.permissions);
    }

    return options;
  }
}
