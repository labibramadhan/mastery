import test from 'ava';
import URI from 'urijs';
import path from 'path';
import HttpStatus from 'http-status-codes';

import mockUsers from '../helpers/mock-users';
import { prefix } from '../../src/setup/config';

mockUsers(test);

test.beforeEach(`login POST ${prefix}user/login`, async (t) => {
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

test(`findAll GET ${prefix}users?${URI.buildQuery({ username: 'authenticated1' }).toString()}`, async (t) => {
  const { users, server, token } = t.context;
  const { authenticated1 } = users;

  const { result, statusCode } = await server.inject({
    url: `${prefix}users?${URI.buildQuery({ username: 'authenticated1', token: token }).toString()}`,
    method: 'GET',
  });
  t.is(statusCode, HttpStatus.OK);
  t.is(result.length, 1);
  t.is(result[0].id, authenticated1.id);
});

test(`findOne GET ${prefix}user?${URI.buildQuery({ username: 'authenticated2' }).toString()}`, async (t) => {
  const { users, server, token } = t.context;
  const { authenticated2 } = users;

  const { result, statusCode } = await server.inject({
    url: `${prefix}user?${URI.buildQuery({ username: 'authenticated2', token: token }).toString()}`,
    method: 'GET',
  });
  t.is(statusCode, HttpStatus.OK);
  t.is(result.id, authenticated2.id);
});

test(`findById GET ${prefix}user/{id}`, async (t) => {
  const { users, server, token } = t.context;
  const { authenticated2 } = users;

  const { result, statusCode } = await server.inject({
    url: path.join(prefix, 'user', authenticated2.id.toString()) + `?token=${token}`,
    method: 'GET',
  });
  t.is(statusCode, HttpStatus.OK);
  t.is(result.id, authenticated2.id);
});

test(`count GET ${prefix}users/count?${URI.buildQuery({ username: ['authenticated1', 'authenticated2'] })}`, async (t) => {
  const { server, token } = t.context;

  const { result, statusCode } = await server.inject({
    url: `${prefix}users/count?${URI.buildQuery({ username: ['authenticated1', 'authenticated2'], token: token })}`,
    method: 'GET',
  });
  t.is(statusCode, HttpStatus.OK);
  t.is(result.count, 2);
});
