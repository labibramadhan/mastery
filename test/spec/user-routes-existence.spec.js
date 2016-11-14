import test from 'ava';
import path from 'path';

import mockUsers from '../helpers/mock-users';
import userRoutes from '../../src/component/user/userRoutes';
import { prefix } from '../../src/setup/config';

mockUsers(test);

test.beforeEach('Handler generator for user', (t) => {
  const { sequelize, server } = t.context;
  server.route(userRoutes(sequelize.models));
});

// eslint-disable-next-line no-shadow
const confirmRoute = async (t, { path, method }) => {
  const { server } = t.context;

  const routes = server.table()[0].table;

  t.truthy(routes.find(route =>
     route.path === path && route.method === method.toLowerCase(),
  ));
};

const expectedRoutes = [{
  path: path.join(prefix, 'users'),
  method: 'GET',
  type: 'findAll',
}, {
  path: path.join(prefix, 'users', 'count'),
  method: 'GET',
  type: 'count',
}, {
  path: path.join(prefix, 'user'),
  method: 'GET',
  type: 'findOne',
}, {
  path: path.join(prefix, 'user', '{id}'),
  method: 'GET',
  type: 'findById',
}];

expectedRoutes.forEach((expectedRoute) => {
  test(`${expectedRoute.type} ${expectedRoute.method} ${expectedRoute.path}`, confirmRoute, expectedRoute);
});
