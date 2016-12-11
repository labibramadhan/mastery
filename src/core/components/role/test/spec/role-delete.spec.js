import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../test/helpers/setup');
const mockRoles = require('../../../../test/helpers/mock-roles');

const prefix = conf.get('prefix');

describe(`role delete DELETE ${prefix}role/{pk}`, () => {
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
      method: 'DELETE',
      credentials: {
        scope: ['role:delete'],
      },
    });

    assert.equal(statusCode, HttpStatus.NO_CONTENT);
    assert.equal(result, null);
  });
});
