import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../test/helpers/setup');
const mockRoles = require('../../../../test/helpers/mock-roles');

const prefix = conf.get('prefix');

describe(`role update POST ${prefix}role/{pk}`, () => {
  before(async function before() {
    await setup();
    await mockRoles.bind(this).apply();
  });

  it('works', async function it() {
    const {
      role1,
    } = this.roles;

    const thisTestUrl = `${prefix}role/${role1.id}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      payload: {
        name: 'role1-updated',
      },
      method: 'POST',
      credentials: {
        scope: ['role:update'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.name, 'role1-updated');
  });
});
