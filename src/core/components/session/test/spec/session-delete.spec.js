import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../test/helpers/setup');
const mockUsers = require('../../../../test/helpers/mock-users');
const mockSessions = require('../../../../test/helpers/mock-sessions');

const prefix = conf.get('prefix');

describe(`session delete DELETE ${prefix}session/{pk}`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    await mockSessions.bind(this).apply();
  });

  it('works', async function it() {
    const {
      session4,
    } = this.sessions;

    const thisTestUrl = `${prefix}session/${session4.id}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'DELETE',
      credentials: {
        scope: ['session:delete'],
      },
    });

    assert.equal(statusCode, HttpStatus.NO_CONTENT);
    assert.equal(result, null);
  });
});
