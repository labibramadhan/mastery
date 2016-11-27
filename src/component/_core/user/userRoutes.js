import path from 'path';
import Joi from 'joi';

const prefix = conf.get('prefix');
const HandlerGeneratorFindAll = requireF('services/_core/HandlerGeneratorFindAll');
const HandlerGeneratorCount = requireF('services/_core/HandlerGeneratorCount');
const HandlerGeneratorCreate = requireF('services/_core/HandlerGeneratorCreate');
const HandlerGeneratorFindOne = requireF('services/_core/HandlerGeneratorFindOne');
const HandlerGeneratorFindById = requireF('services/_core/HandlerGeneratorFindById');
const HandlerGeneratorAssociations = requireF('services/_core/HandlerGeneratorAssociations');
const UserHandlerLogin = requireF('component/_core/user/UserHandlerLogin');
const requestValidators = requireF('services/_core/requestValidators').default;
const authStrategiesConfig = requireF('setup/config/authStrategiesConfig');

export default (models) => {
  // define user component endpoint
  const validators = new requestValidators(models, models.user); // eslint-disable-line new-cap

  const handlerFindAll = new HandlerGeneratorFindAll(models.user, 'user');
  const handlerCount = new HandlerGeneratorCount(models.user, 'user');
  const handlerCreate = new HandlerGeneratorCreate(models.user, 'user');
  const handlerFindOne = new HandlerGeneratorFindOne(models.user, 'user');
  const handlerFindById = new HandlerGeneratorFindById(models.user, 'user');
  const handlerLogin = new UserHandlerLogin();
  const handlerAssociations = new HandlerGeneratorAssociations(models.user, 'user', ['roles']);
  handlerAssociations.generate();

  return [{
    // define GET /users route
    method: 'GET',
    path: path.join(prefix, 'users'),
    handler: handlerFindAll.handler,
    config: {
      auth: {
        strategies: Object.keys(authStrategiesConfig),
        scope: handlerFindAll.permissions,
      },
      validate: {
        ...validators.findAll,
      },
    },
  }, {
    // define GET /users/count route
    method: 'GET',
    path: path.join(prefix, 'users', 'count'),
    handler: handlerCount.handler,
    config: {
      auth: {
        strategies: Object.keys(authStrategiesConfig),
        scope: handlerCount.permissions,
      },
      validate: {
        ...validators.count,
      },
    },
  }, {
    // define GET /user route
    method: 'GET',
    path: path.join(prefix, 'user'),
    handler: handlerFindOne.handler,
    config: {
      auth: {
        strategies: Object.keys(authStrategiesConfig),
        scope: handlerFindOne.permissions,
      },
      validate: {
        ...validators.findOne,
      },
    },
  }, {
    // define PUT /users route
    method: 'PUT',
    path: path.join(prefix, 'user'),
    handler: handlerCreate.handler,
    config: {
      auth: {
        strategies: Object.keys(authStrategiesConfig),
        scope: handlerCreate.permissions,
      },
      validate: {
        ...validators.create,
      },
    },
  }, {
    // define GET /user/{id} route
    method: 'GET',
    path: path.join(prefix, 'user', '{id}'),
    handler: handlerFindById.handler,
    config: {
      auth: {
        strategies: Object.keys(authStrategiesConfig),
        scope: handlerFindById.permissions,
      },
      validate: {
        ...validators.findById,
      },
    },
  }, {
    // define /user/login route
    method: 'POST',
    path: path.join(prefix, 'user', 'login'),
    handler: handlerLogin.handler,
  }, {
    // define GET /user/{id}/roles route
    method: 'GET',
    path: path.join(prefix, 'user', '{id}', 'roles'),
    handler: handlerAssociations.rolesFindAll.handler,
    config: {
      auth: {
        strategies: Object.keys(authStrategiesConfig),
        scope: handlerAssociations.rolesFindAll.permissions,
      },
      validate: {
        query: Joi.any(),
      },
    },
  }, {
    // define GET /user/{id}/roles/count route
    method: 'GET',
    path: path.join(prefix, 'user', '{id}', 'roles', 'count'),
    handler: handlerAssociations.rolesCount.handler,
    config: {
      auth: {
        strategies: Object.keys(authStrategiesConfig),
        scope: handlerAssociations.rolesCount.permissions,
      },
      validate: {
        query: Joi.any(),
      },
    },
  }];
};
