import test from 'ava';
import URI from 'urijs';
import HttpStatus from 'http-status-codes';

import mockUsers from '../../../../../helpers/mock-users';

const { prefix } = requireF('setup/config');

mockUsers(test);

test.beforeEach(`POST login admin2 ${prefix}user/login`, async (t) => {
  const { users, server } = t.context;
  const { admin2 } = users;

  const { result, statusCode } = await server.inject({
    url: `${prefix}user/login`,
    method: 'POST',
    payload: {
      username: admin2.username,
      password: 'Asdqwe123',
    },
  });

  t.is(statusCode, HttpStatus.OK);
  t.truthy(result.token);

  // eslint-disable-next-line no-param-reassign
  t.context.token = result.token;
});

test(`GET countBelongsToMany ${prefix}user/{id}/roles/count`, async (t) => {
  const { users, server, token } = t.context;
  const { admin2 } = users;

  const thisTestUrl = URI(`${prefix}user/${admin2.id}/roles/count`).addQuery({
    token,
  }).toString();

  const { result, statusCode } = await server.inject({
    url: thisTestUrl,
    method: 'GET',
  });

  t.is(statusCode, HttpStatus.OK);
  t.is(result.count, 2);
});

