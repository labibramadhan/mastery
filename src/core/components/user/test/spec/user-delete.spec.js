import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`user delete DELETE ${prefix}user/{pk}`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      authenticated2,
    } = this.users;

    const thisTestUrl = `${prefix}user/${authenticated2.id}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'DELETE',
      credentials: {
        scope: ['user:delete'],
      },
    });

    assert.equal(statusCode, HttpStatus.NO_CONTENT);
    assert.equal(result, null);
  });
});
