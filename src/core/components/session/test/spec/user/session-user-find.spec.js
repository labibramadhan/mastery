import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');
const mockSessions = require('../../../../../test/helpers/mock-sessions');

const prefix = conf.get('prefix');

describe(`session associationFind GET ${prefix}session/{pk}/user`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    await mockSessions.bind(this).apply();
  });

  it('works', async function it() {
    const {
      admin1,
    } = this.users;
    const {
      session3,
    } = this.sessions;

    const thisTestUrl = `${prefix}session/${session3.id}/user`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'GET',
      credentials: {
        scope: ['session:findById', 'session:user:find'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.id, admin1.id);
    assert.equal(result.username, admin1.username);
  });
});
