import test from 'ava';
import URI from 'urijs';
import HttpStatus from 'http-status-codes';

import mockUsers from '../../../../../helpers/mock-users';

const { prefix } = requireF('setup/config/commonConfigs');

mockUsers(test);

test.beforeEach(`POST login admin1 ${prefix}user/login`, async (t) => {
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
