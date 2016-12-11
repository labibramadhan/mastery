import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`user unlink DELETE ${prefix}user/{pk}/roles/unlink/{pk2}`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      admin1,
    } = this.users;
    const {
      adminRole,
    } = this.roles;
    const thisTestUrl = `${prefix}user/${admin1.id}/roles/unlink/${adminRole.id}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'DELETE',
      credentials: {
        scope: ['user:findById', 'user:roles:unlink'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.unlink, 1);
  });
});
