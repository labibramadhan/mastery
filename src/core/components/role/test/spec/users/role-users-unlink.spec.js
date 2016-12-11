import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`role unlink DELETE ${prefix}role/{pk}/users/unlink/{pk2}`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      admin2,
    } = this.users;
    const {
      adminRole,
    } = this.roles;

    const thisTestUrl = `${prefix}role/${adminRole.id}/users/unlink/${admin2.id}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'DELETE',
      credentials: {
        scope: ['role:findById', 'role:users:unlink'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.unlink, 1);
  });
});
