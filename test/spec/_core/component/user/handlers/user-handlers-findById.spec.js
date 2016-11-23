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
