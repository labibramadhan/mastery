import test from 'ava';
import URI from 'urijs';
import path from 'path';
import HttpStatus from 'http-status-codes';

import mockUsers from '../helpers/mock-users';
import userRoutes from '../../src/component/user/userRoutes';
import { prefix } from '../../src/setup/config';

mockUsers(test);

test.beforeEach('User handler generator', (t) => {
  const { sequelize, server } = t.context;
  server.route(userRoutes(sequelize.models));
});

const payloadLogin = {
  url: path.join(prefix, 'user', 'login'),
  method: 'POST',
};
test.beforeEach(`login ${payloadLogin.method} ${payloadLogin.url}`, async (t) => {
  const { users, server } = t.context;
  const { user1 } = users;

  const { result } = await server.inject({
    payload: {
      username: user1.username,
      password: 'Asdqwe123',
    },
    ...payloadLogin,
  });

  // eslint-disable-next-line no-param-reassign
  t.context.token = result.token;
});

const queryFindAll = {
  url: `${path.join(prefix, 'users')}?${URI.buildQuery({ username: 'user1' }).toString()}`,
  method: 'GET',
};
test(`findAll ${queryFindAll.method} ${queryFindAll.url}`, async (t) => {
  const { users, server, token } = t.context;
  const { user1 } = users;

  const { result, statusCode } = await server.inject({ ...queryFindAll, url: `${queryFindAll.url}&token=${token}` });
  t.is(statusCode, HttpStatus.OK);
  t.is(result.length, 1);
  t.is(result[0].id, user1.id);
});

const queryFindOne = {
  url: `${path.join(prefix, 'user')}?${URI.buildQuery({ username: 'user2' }).toString()}`,
  method: 'GET',
};
test(`findOne ${queryFindOne.method} ${queryFindOne.url}`, async (t) => {
  const { users, server, token } = t.context;
  const { user2 } = users;

  const { result, statusCode } = await server.inject({ ...queryFindOne, url: `${queryFindOne.url}&token=${token}` });
  t.is(statusCode, HttpStatus.OK);
  t.is(result.id, user2.id);
});

const queryFindById = {
  url: path.join(prefix, 'user', '3'),
  method: 'GET',
};
test(`findById ${queryFindById.method} ${queryFindById.url}`, async (t) => {
  const { users, server, token } = t.context;
  const { user3 } = users;

  const { result, statusCode } = await server.inject({ ...queryFindById, url: `${queryFindById.url}?token=${token}` });
  t.is(statusCode, HttpStatus.OK);
  t.is(result.id, user3.id);
});

const queryCount = {
  url: `${path.join(prefix, 'users', 'count')}?${URI.buildQuery({ username: ['user1', 'user2'] })}`,
  method: 'GET',
};
test(`count ${queryCount.method} ${queryCount.url}`, async (t) => {
  const { server, token } = t.context;

  const { result, statusCode } = await server.inject({ ...queryCount, url: `${queryCount.url}&token=${token}` });
  t.is(statusCode, HttpStatus.OK);
  t.is(result.count, 2);
});
