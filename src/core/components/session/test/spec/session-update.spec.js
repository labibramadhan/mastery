import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../test/helpers/setup');
const mockUsers = require('../../../../test/helpers/mock-users');
const mockSessions = require('../../../../test/helpers/mock-sessions');

const prefix = conf.get('prefix');

describe(`session update POST ${prefix}session/{pk}`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    await mockSessions.bind(this).apply();
  });

  it('works', async function it() {
    const {
      session1,
    } = this.sessions;

    const thisTestUrl = `${prefix}session/${session1.id}`;

    const updateObject = {
      token: 'session1updated',
      platform: 'session1updated',
    };

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'POST',
      payload: updateObject,
      credentials: {
        scope: ['session:update'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.token, updateObject.token);
    assert.equal(result.platform, updateObject.platform);
  });
});
