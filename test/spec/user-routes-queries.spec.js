import test from 'ava';
import URI from 'urijs';
import HttpStatus from 'http-status-codes';

import mockUsers from '../helpers/mock-users';
import { prefix } from '../../src/setup/config';

mockUsers(test);

test.beforeEach('user POST login', async (t) => {
  const { users, server } = t.context;
  const { admin1 } = users;

  const { result, statusCode } = await server.inject({
    url: `${prefix}user/login`,
    method: 'POST',
    payload: {
      username: admin1.username,
      password: 'Asdqwe123',
    },
  });

  t.is(statusCode, HttpStatus.OK);
  t.truthy(result.token);

  // eslint-disable-next-line no-param-reassign
  t.context.token = result.token;
});


test(`GET findAll ${URI(`${prefix}users`).addQuery({
  username: 'authenticated1',
  include: 'role',
}).toString()}`, async (t) => {
  const { users, roles, server, token } = t.context;
  const { authenticated1 } = users;
  const { authenticatedRole } = roles;

  const thisTestUrl = URI(`${prefix}users`).addQuery({
    username: 'authenticated1',
    include: 'role',
    token,
  }).toString();

  const { result, statusCode } = await server.inject({
    url: thisTestUrl,
    method: 'GET',
  });

  t.is(statusCode, HttpStatus.OK);
  t.is(result.length, 1);
  t.is(result[0].id, authenticated1.id);
  t.is(result[0].roles[0].id, authenticatedRole.id);
});

test(`GET findOne ${URI(`${prefix}user`).addQuery({
  username: 'authenticated2',
  include: JSON.stringify({ model: 'role' }),
}).toString()}`, async (t) => {
  const { users, roles, server, token } = t.context;
  const { authenticated2 } = users;
  const { authenticatedRole } = roles;

  const thisTestUrl = URI(`${prefix}user`).addQuery({
    username: 'authenticated2',
    include: JSON.stringify({ model: 'role' }),
    token,
  }).toString();

  const { result, statusCode } = await server.inject({
    url: thisTestUrl,
    method: 'GET',
  });

  t.is(statusCode, HttpStatus.OK);
  t.is(result.id, authenticated2.id);
  t.is(result.roles[0].id, authenticatedRole.id);
});

test(`GET findById ${URI(`${prefix}user/{id}`).toString()}`, async (t) => {
  const { users, server, token } = t.context;
  const { authenticated2 } = users;

  const thisTestUrl = URI(`${prefix}user/${authenticated2.id}`).addQuery({ token }).toString();

  const { result, statusCode } = await server.inject({
    url: thisTestUrl,
    method: 'GET',
  });

  t.is(statusCode, HttpStatus.OK);
  t.is(result.id, authenticated2.id);
});

test(`GET count ${URI(`${prefix}users/count`).addQuery({
  username: [
    'authenticated1',
    'authenticated2',
  ],
}).toString()}`, async (t) => {
  const { server, token } = t.context;

  const thisTestUrl = URI(`${prefix}users/count`).addQuery({
    username: [
      'authenticated1',
      'authenticated2',
    ],
    token,
  }).toString();

  const { result, statusCode } = await server.inject({
    url: thisTestUrl,
    method: 'GET',
  });

  t.is(statusCode, HttpStatus.OK);
  t.is(result.count, 2);
});
