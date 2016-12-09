import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`PUT create ${prefix}role`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async () => {
    const thisTestUrl = `${prefix}role`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      payload: {
        name: 'role1',
      },
      method: 'PUT',
      credentials: {
        scope: ['role:create'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.name, 'role1');
  });
});
