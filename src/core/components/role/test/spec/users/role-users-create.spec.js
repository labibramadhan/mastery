import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`PUT associationCreate ${prefix}role/{pk}/users`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      adminRole,
    } = this.roles;

    const thisTestUrl = `${prefix}role/${adminRole.id}/users`;

    const userObj = {
      username: 'admin3',
      email: 'admin3@mailinator.com',
      password: 'admin3password',
    };

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'PUT',
      payload: userObj,
      credentials: {
        scope: ['role:findById', 'role:users:create'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.username, userObj.username);
    assert.equal(result.email, userObj.email);
  });
});
