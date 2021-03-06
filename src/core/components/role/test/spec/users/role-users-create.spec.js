import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`role associationCreate PUT ${prefix}role/{pk}/users`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      adminRole,
    } = this.roles;
    const {
      userObj1,
    } = this.users;

    const thisTestUrl = `${prefix}role/${adminRole.id}/users`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'PUT',
      payload: userObj1,
      credentials: {
        scope: ['role:findById', 'role:users:create'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.username, userObj1.username);
    assert.equal(result.email, userObj1.email.toLowerCase());
  });
});
