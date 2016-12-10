import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`PUT associationCreate ${prefix}user/{pk}/roles`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      adminRole,
    } = this.roles;

    const thisTestUrl = `${prefix}user/${adminRole.id}/roles`;

    const roleObj = {
      name: 'role1',
    };

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'PUT',
      payload: roleObj,
      credentials: {
        scope: ['user:findById', 'user:roles:create'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.name, roleObj.name);
  });
});
