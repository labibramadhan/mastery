import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../test/helpers/setup');
const mockUsers = require('../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`user update POST ${prefix}user/{pk}`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      admin1,
    } = this.users;

    const thisTestUrl = `${prefix}user/${admin1.id}`;

    const userObj = {
      username: 'admin1updated',
      email: 'admin1updated@mailinator.com',
    };

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'POST',
      payload: userObj,
      credentials: {
        scope: ['user:update'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.username, userObj.username);
    assert.equal(result.email, userObj.email);
  });
});
