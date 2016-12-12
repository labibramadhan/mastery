import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockRoles = require('../../../../../test/helpers/mock-roles');
const mockUsers = require('../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`user associationSet POST ${prefix}user/{pk}/roles/set`, () => {
  before(async function before() {
    await setup();
    await mockRoles.bind(this).apply();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      authenticated2,
    } = this.users;
    const {
      role2,
      role3,
    } = this.roles;
    const thisTestUrl = `${prefix}user/${authenticated2.id}/roles/set`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'POST',
      payload: [
        role2.id,
        role3.id,
      ],
      credentials: {
        scope: ['user:findById', 'user:roles:set'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result[0].userId, authenticated2.id);
    assert.oneOf(result[0].roleId, [role2.id, role3.id]);
    assert.equal(result[1].userId, authenticated2.id);
    assert.oneOf(result[1].roleId, [role2.id, role3.id]);
  });
});
