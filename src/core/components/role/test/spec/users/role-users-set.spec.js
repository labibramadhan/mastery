import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');
const mockRoles = require('../../../../../test/helpers/mock-roles');

const prefix = conf.get('prefix');

describe(`role associationSet POST ${prefix}role/{pk}/users/set`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    await mockRoles.bind(this).apply();
  });

  it('works', async function it() {
    const {
      authenticated1,
      authenticated2,
      admin2,
    } = this.users;
    const {
      role1,
    } = this.roles;

    const thisTestUrl = `${prefix}role/${role1.id}/users/set`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'POST',
      payload: [authenticated1.id, authenticated2.id, admin2.id],
      credentials: {
        scope: ['role:findById', 'role:users:set'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result[0].roleId, role1.id);
    assert.oneOf(result[0].userId, [authenticated1.id, authenticated2.id, admin2.id]);
    assert.equal(result[1].roleId, role1.id);
    assert.oneOf(result[1].userId, [authenticated1.id, authenticated2.id, admin2.id]);
    assert.equal(result[2].roleId, role1.id);
    assert.oneOf(result[2].userId, [authenticated1.id, authenticated2.id, admin2.id]);
  });
});
