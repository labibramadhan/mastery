import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`user associationHasAll POST ${prefix}user/{pk}/roles/has`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      admin1,
    } = this.users;
    const {
      authenticatedRole,
      adminRole,
    } = this.roles;

    const thisTestUrl = `${prefix}user/${admin1.id}/roles/has`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'POST',
      payload: [authenticatedRole.id, adminRole.id],
      credentials: {
        scope: ['user:findById', 'user:roles:hasAll'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result, null);
  });
});
