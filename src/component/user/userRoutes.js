import path from 'path';

import { prefix } from '../../setup/config';
import HandlerGenerator from '../../services/HandlerGenerator';
import userControllerLogin from './userControllerLogin';

export default (models) => {
  const handler = new HandlerGenerator(models.user);
  return [{
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
    method: 'PUT',
    path: path.join(prefix, 'user'),
    handler: handler.create,
  }, {
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
    method: 'POST',
    path: path.join(prefix, 'user', 'login'),
    handler: userControllerLogin,
  }];
};
