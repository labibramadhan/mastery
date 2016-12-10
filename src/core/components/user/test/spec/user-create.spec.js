import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`user create PUT ${prefix}user`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async () => {
    const thisTestUrl = `${prefix}user`;

    const userObj = {
      username: 'admin0',
      email: 'admin0@mailinator.com',
      password: 'admin0password',
    };

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'PUT',
      payload: userObj,
      credentials: {
        scope: ['user:create'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.username, userObj.username);
    assert.equal(result.email, userObj.email);
  });
});
