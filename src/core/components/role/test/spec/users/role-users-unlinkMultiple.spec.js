import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`DELETE unlinkMultiple ${prefix}role/{pk}/users/unlink`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      authenticated1,
      admin2,
    } = this.users;
    const {
      adminRole,
    } = this.roles;
    const thisTestUrl = `${prefix}role/${adminRole.id}/users/unlink`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'DELETE',
      payload: [
        authenticated1.id,
        admin2.id,
      ],
      credentials: {
        scope: ['role:findById', 'role:users:unlinkMultiple'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.unlink, 1);
  });
});
