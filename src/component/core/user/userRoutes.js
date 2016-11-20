import path from 'path';
import Joi from 'joi';

const {
  prefix,
} = requireF('setup/config');
const handlersGenerator = requireF('services/core/handlersGenerator').default;
const requestValidators = requireF('services/core/requestValidators').default;
const userControllerLogin = requireF('component/core/user/userControllerLogin');

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
        strategy: 'jwt',
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
        strategy: 'jwt',
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
        strategy: 'jwt',
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
        strategy: 'jwt',
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
        strategy: 'jwt',
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
        strategy: 'jwt',
        scope: handlers.rolesCount.permissions,
      },
      validate: {
        query: Joi.any(),
      },
    },
  }];
};
