import _ from 'lodash';
import path from 'path';

const HandlerGeneratorFindById = requireF('services/_core/handlerGenerators/HandlerGeneratorFindById');
const RequestValidators = requireF('services/_core/requestValidators/RequestValidators');

const authStrategiesConfig = requireF('setup/config/authStrategiesConfig');

export default class RouteGeneratorFindById {
  constructor(model) {
    this.model = model;
    this.requestValidators = new RequestValidators(model);
    this.modelConf = conf.get(`models:${model.name}:methods:findById`);
    this.authenticate = _.has(this.modelConf, 'authenticate') && this.modelConf.authenticate;
    this.singular = conf.get(`models:${model.name}:singular`) || model.name;
    this.prefix = conf.get('prefix');
    this.method = 'GET';
    this.path = path.join(this.prefix, this.singular, '{id}');
    this.tags = ['api', 'generator', model.name, 'findById'];
    this.permissions = [`${model.name}:findById`, `${model.name}:own:findById`];
  }

  generate() {
    const options = {};
    const handlerFindById = new HandlerGeneratorFindById(this.model);

    _.set(options, 'method', this.method);
    _.set(options, 'path', this.path);
    _.set(options, 'config.tags', this.tags);
    _.set(options, 'handler', handlerFindById.handler);

    this.requestValidators.build();
    _.set(options, 'config.validate', this.requestValidators.findById);

    if (this.authenticate) {
      _.set(options, 'config.auth.strategies', Object.keys(authStrategiesConfig));
      _.set(options, 'config.auth.scope', this.permissions);
    }

    return options;
  }
}
