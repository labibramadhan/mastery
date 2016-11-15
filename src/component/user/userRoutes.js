import path from 'path';

import { prefix } from '../../setup/config';
import HandlerGenerator from '../../services/handlerGenerator';
import userControllerLogin from './userControllerLogin';

export default (models) => {
  // define user component endpoint
  const handler = new HandlerGenerator(models.user);
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
    },
  }, {
    // define PUT /users route
    method: 'PUT',
    path: path.join(prefix, 'user'),
    handler: handler.create,
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
    },
  }, {
    // define /user/login route
    method: 'POST',
    path: path.join(prefix, 'user', 'login'),
    handler: userControllerLogin,
  }];
};
