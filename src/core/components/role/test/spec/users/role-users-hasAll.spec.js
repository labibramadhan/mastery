import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');
const mockRoles = require('../../../../../test/helpers/mock-roles');

const prefix = conf.get('prefix');

describe(`role associationHasAll POST ${prefix}role/{pk}/users/has`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    await mockRoles.bind(this).apply();
  });

  it('works', async function it() {
    const {
      admin1,
      admin2,
    } = this.users;
    const {
      adminRole,
    } = this.roles;

    const thisTestUrl = `${prefix}role/${adminRole.id}/users/has`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'POST',
      payload: [admin1.id, admin2.id],
      credentials: {
        scope: ['role:findById', 'role:users:hasAll'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result, null);
  });
});
