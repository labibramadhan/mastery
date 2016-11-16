import path from 'path';

import { prefix } from '../../setup/config';
import handlersGenerator from '../../services/handlersGenerator';
import requestValidators from '../../services/requestValidators';
import userControllerLogin from './userControllerLogin';

export default (models) => {
  // define user component endpoint
  const handler = new handlersGenerator(models.user);
  const validators = new requestValidators(models, models.user);

  return [{
    // define GET /users route
    method: 'GET',
    path: path.join(prefix, 'users'),
    handler: handler.findAll,
    config: {
      auth: {
        strategy: 'jwt',
        scope: 'user:findAll',
      },
      validate: {
        ...validators.findAll
      },
    },
  }, {
    // define GET /users/count route
    method: 'GET',
    path: path.join(prefix, 'users', 'count'),
    handler: handler.count,
    config: {
      auth: {
        strategy: 'jwt',
        scope: 'user:count',
      },
      validate: {
        ...validators.count
      },
    },
  }, {
    // define GET /user route
    method: 'GET',
    path: path.join(prefix, 'user'),
    handler: handler.findOne,
    config: {
      auth: {
        strategy: 'jwt',
        scope: 'user:findOne',
      },
      validate: {
        ...validators.findOne
      },
    },
  }, {
    // define PUT /users route
    method: 'PUT',
    path: path.join(prefix, 'user'),
    handler: handler.create,
    config: {
      validate: {
        ...validators.create
      },
    }
  }, {
    // define GET /user/{id} route
    method: 'GET',
    path: path.join(prefix, 'user', '{id}'),
    handler: handler.findById,
    config: {
      auth: {
        strategy: 'jwt',
        scope: 'user:findById',
      },
      validate: {
        ...validators.findById
      },
    },
  }, {
    // define /user/login route
    method: 'POST',
    path: path.join(prefix, 'user', 'login'),
    handler: userControllerLogin,
  }];
};
