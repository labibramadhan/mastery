import _ from 'lodash';
import Joi from 'joi';
import path from 'path';

const HandlerGeneratorAssociationFindAll = requireF('services/_core/handlerGenerators/associations/HandlerGeneratorAssociationFindAll');
const RequestValidators = requireF('services/_core/requestValidators/RequestValidators');

const authStrategiesConfig = requireF('setup/config/authStrategiesConfig');

export default class RouteGeneratorAssociationFindAll {
  constructor(model, association) {
    this.model = model;
    this.association = association;
    this.requestValidators = new RequestValidators(model);
    this.modelConf = conf.get(`models:${model.name}:methods:associations:${association.as}:findAll`);
    this.authenticate = _.has(this.modelConf, 'authenticate') && this.modelConf.authenticate;
    this.singular = conf.get(`models:${model.name}:singular`) || model.name;
    this.prefix = conf.get('prefix');
    this.method = 'GET';
    this.path = path.join(this.prefix, this.singular, '{id}', association.as);
    this.tags = ['api', 'generator', model.name, 'findAllOneToMany', association.as];
    this.permissions = [`${model.name}:${association.as}:findAll`, `${model.name}:own:${association.as}:findAll`, `${model.name}:own:${association.as}:own:findAll`];
  }

  generate() {
    const options = {};
    const handlerAssociationFindAll = new HandlerGeneratorAssociationFindAll(
      this.model,
      this.association,
    );

    _.set(options, 'method', this.method);
    _.set(options, 'path', this.path);
    _.set(options, 'config.tags', this.tags);
    _.set(options, 'handler', handlerAssociationFindAll.handler);

    this.requestValidators.build();
    _.set(options, 'config.validate', {
      query: Joi.any(),
    });

    if (this.authenticate) {
      _.set(options, 'config.auth.strategies', Object.keys(authStrategiesConfig));
      _.set(options, 'config.auth.scope', this.permissions);
    }

    return options;
  }
}
