import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`user associationUnlinkMultiple UNLINK ${prefix}user/{pk}/roles/unlink`, () => {
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
      authenticatedRole,
    } = this.roles;
    const thisTestUrl = `${prefix}user/${admin1.id}/roles/unlink`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'UNLINK',
      payload: [
        adminRole.id,
        authenticatedRole.id,
      ],
      credentials: {
        scope: ['user:findById', 'user:roles:unlinkMultiple'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.unlink, 2);
  });
});
