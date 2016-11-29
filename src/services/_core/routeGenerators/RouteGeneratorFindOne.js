import _ from 'lodash';
import path from 'path';

const HandlerGeneratorFindOne = requireF('services/_core/handlerGenerators/HandlerGeneratorFindOne');
const RequestValidators = requireF('services/_core/requestValidators/RequestValidators');

const authStrategiesConfig = requireF('setup/config/authStrategiesConfig');

export default class RouteGeneratorFindOne {
  constructor(model) {
    this.model = model;
    this.requestValidators = new RequestValidators(model);
    this.modelConf = conf.get(`${model.name}:methods:findOne`);
    this.authenticate = _.has(this.modelConf, 'authenticate') && this.modelConf.authenticate;
    this.singular = conf.get(`${model.name}:singular`) || model.name;
    this.prefix = conf.get('prefix');
    this.method = 'GET';
    this.path = path.join(this.prefix, this.singular);
  }

  generate() {
    const options = {};
    const handlerFindOne = new HandlerGeneratorFindOne(this.model);

    _.set(options, 'method', this.method);
    _.set(options, 'path', this.path);
    _.set(options, 'handler', handlerFindOne.handler);

    this.requestValidators.build();
    _.set(options, 'config.validate', this.requestValidators.findOne);

    if (this.authenticate) {
      _.set(options, 'config.auth.strategies', Object.keys(authStrategiesConfig));
      _.set(options, 'config.auth.scope', handlerFindOne.permissions);
    }

    return options;
  }
}
