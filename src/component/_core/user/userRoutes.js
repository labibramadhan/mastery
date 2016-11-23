import path from 'path';
import Joi from 'joi';

const {
  prefix,
} = requireF('setup/config/commonConfigs');
const handlersGenerator = requireF('services/_core/handlersGenerator').default;
const requestValidators = requireF('services/_core/requestValidators').default;
const userControllerLogin = requireF('component/_core/user/userControllerLogin');
const authStrategiesConfig = requireF('setup/config/authStrategiesConfig');

export default (models) => {
  // define user component endpoint
  // eslint-disable-next-line new-cap
  const handlers = new handlersGenerator(models.user, {
    componentId: 'user',
    associations: ['roles'],
  });
  const validators = new requestValidators(models, models.user); // eslint-disable-line new-cap

  return [{
    // define GET /users route
    method: 'GET',
    path: path.join(prefix, 'users'),
    handler: handlers.findAll,
    config: {
      auth: {
        strategies: Object.keys(authStrategiesConfig),
        scope: handlers.findAll.permissions,
      },
      validate: {
        ...validators.findAll,
      },
    },
  }, {
    // define GET /users/count route
    method: 'GET',
    path: path.join(prefix, 'users', 'count'),
    handler: handlers.count,
    config: {
      auth: {
        strategies: Object.keys(authStrategiesConfig),
        scope: handlers.count.permissions,
      },
      validate: {
        ...validators.count,
      },
    },
  }, {
    // define GET /user route
    method: 'GET',
    path: path.join(prefix, 'user'),
    handler: handlers.findOne,
    config: {
      auth: {
        strategies: Object.keys(authStrategiesConfig),
        scope: handlers.findOne.permissions,
      },
      validate: {
        ...validators.findOne,
      },
    },
  }, {
    // define PUT /users route
    method: 'PUT',
    path: path.join(prefix, 'user'),
    handler: handlers.create,
    config: {
      validate: {
        ...validators.create,
      },
    },
  }, {
    // define GET /user/{id} route
    method: 'GET',
    path: path.join(prefix, 'user', '{id}'),
    handler: handlers.findById,
    config: {
      auth: {
        strategies: Object.keys(authStrategiesConfig),
        scope: handlers.findById.permissions,
      },
      validate: {
        ...validators.findById,
      },
    },
  }, {
    // define /user/login route
    method: 'POST',
    path: path.join(prefix, 'user', 'login'),
    handler: userControllerLogin,
  }, {
    // define GET /user/{id}/roles route
    method: 'GET',
    path: path.join(prefix, 'user', '{id}', 'roles'),
    handler: handlers.rolesFindAll,
    config: {
      auth: {
        strategies: Object.keys(authStrategiesConfig),
        scope: handlers.rolesFindAll.permissions,
      },
      validate: {
        query: Joi.any(),
      },
    },
  }, {
    // define GET /user/{id}/roles/count route
    method: 'GET',
    path: path.join(prefix, 'user', '{id}', 'roles', 'count'),
    handler: handlers.rolesCount,
    config: {
      auth: {
        strategies: Object.keys(authStrategiesConfig),
        scope: handlers.rolesCount.permissions,
      },
      validate: {
        query: Joi.any(),
      },
    },
  }];
};
