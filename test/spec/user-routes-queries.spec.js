import test from 'ava';
import URI from 'urijs';
import path from 'path';
import HttpStatus from 'http-status-codes';

import mockUsers from '../helpers/mock-users';
import { prefix } from '../../src/setup/config';

mockUsers(test);

test.beforeEach(`user POST login`, async (t) => {
  const { users, server } = t.context;
  const { admin1 } = users;

  const { result } = await server.inject({
    url: `${prefix}user/login`,
    method: 'POST',
    payload: {
      username: admin1.username,
      password: 'Asdqwe123',
    },
  });

  // eslint-disable-next-line no-param-reassign
  t.context.token = result.token;
});


test(`user GET findAll`, async (t) => {
  const { users, server, token } = t.context;
  const { authenticated1 } = users;

  const thisTestUrl = URI(`${prefix}users`).addQuery({
    username: 'authenticated1',
    include: 'role',
    token: token
  }).toString();

  const { result, statusCode } = await server.inject({
    url: thisTestUrl,
    method: 'GET',
  });

  t.is(statusCode, HttpStatus.OK);
  t.is(result.length, 1);
  t.is(result[0].id, authenticated1.id);
});

test('user GET findOne', async (t) => {
  const { users, server, token } = t.context;
  const { authenticated2 } = users;

  const thisTestUrl = URI(`${prefix}user`).addQuery({
    username: 'authenticated2',
    include: JSON.stringify({ model: 'role' }),
    token: token
  }).toString();

  const { result, statusCode } = await server.inject({
    url: thisTestUrl,
    method: 'GET',
  });

  t.is(statusCode, HttpStatus.OK);
  t.is(result.id, authenticated2.id);
});

test(`user GET findById`, async (t) => {
  const { users, server, token } = t.context;
  const { authenticated2 } = users;

  const thisTestUrl = URI(`${prefix}user/${authenticated2.id}`).addQuery({ token: token }).toString();

  const { result, statusCode } = await server.inject({
    url: thisTestUrl,
    method: 'GET',
  });

  t.is(statusCode, HttpStatus.OK);
  t.is(result.id, authenticated2.id);
});

test(`user GET count`, async (t) => {
  const { server, token } = t.context;

  const thisTestUrl = URI(`${prefix}users/count`).addQuery({
    username: [
      'authenticated1',
      'authenticated2',
    ],
    token: token
  }).toString();

  const { result, statusCode } = await server.inject({
    url: thisTestUrl,
    method: 'GET',
  });

  t.is(statusCode, HttpStatus.OK);
  t.is(result.count, 2);
});
