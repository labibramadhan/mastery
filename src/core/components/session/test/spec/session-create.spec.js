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
      admin2,
    } = this.users;

    const thisTestUrl = `${prefix}session`;

    const createObject = {
      userId: admin2.id,
      token: 'session5',
      platform: 'session5',
      expiry: 12345,
    };

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'PUT',
      payload: createObject,
      credentials: {
        scope: ['session:create'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.userId, createObject.userId);
    assert.equal(result.token, createObject.token);
    assert.equal(result.platform, createObject.platform);
    assert.equal(result.expiry, createObject.expiry);
  });
});
