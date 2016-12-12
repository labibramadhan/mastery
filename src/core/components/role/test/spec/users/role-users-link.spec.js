import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');
const mockRoles = require('../../../../../test/helpers/mock-roles');

const prefix = conf.get('prefix');

describe(`role associationLink LINK ${prefix}role/{pk}/users/link/{pk2}`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    await mockRoles.bind(this).apply();
  });

  it('works', async function it() {
    const {
      admin2,
    } = this.users;
    const {
      role1,
    } = this.roles;

    const thisTestUrl = `${prefix}role/${role1.id}/users/link/${admin2.id}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'LINK',
      credentials: {
        scope: ['role:findById', 'role:users:link'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.roleId, role1.id);
    assert.equal(result.userId, admin2.id);
  });
});
