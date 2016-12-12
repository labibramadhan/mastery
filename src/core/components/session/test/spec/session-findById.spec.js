import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../test/helpers/setup');
const mockUsers = require('../../../../test/helpers/mock-users');
const mockSessions = require('../../../../test/helpers/mock-sessions');

const prefix = conf.get('prefix');

describe(`session findById GET ${prefix}session/{pk}`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    await mockSessions.bind(this).apply();
  });

  it('works', async function it() {
    const {
      session3,
    } = this.sessions;
    const {
      admin1,
    } = this.users;

    const thisTestUrl = `${prefix}session/${session3.id}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'GET',
      credentials: {
        scope: ['session:findById'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.token, session3.token);
    assert.equal(result.platform, session3.platform);
    assert.equal(result.userId, admin1.id);
  });
});
