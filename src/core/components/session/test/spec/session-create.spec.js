import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../test/helpers/setup');
const mockUsers = require('../../../../test/helpers/mock-users');
const mockSessions = require('../../../../test/helpers/mock-sessions');

const prefix = conf.get('prefix');

describe(`session create PUT ${prefix}session`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    await mockSessions.bind(this).apply();
  });

  it('works', async function it() {
    const {
      sessionObj1,
    } = this.sessions;

    const thisTestUrl = `${prefix}session`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'PUT',
      payload: sessionObj1,
      credentials: {
        scope: ['session:create'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.userId, sessionObj1.userId);
    assert.equal(result.token, sessionObj1.token);
    assert.equal(result.platform, sessionObj1.platform);
    assert.equal(result.expiry, sessionObj1.expiry);
  });
});
