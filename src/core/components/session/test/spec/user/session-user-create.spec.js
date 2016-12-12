import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');
const mockSessions = require('../../../../../test/helpers/mock-sessions');

const prefix = conf.get('prefix');

describe(`session associationCreate PUT ${prefix}session/{pk}/user`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    await mockSessions.bind(this).apply();
  });

  it('works', async function it() {
    const {
      session5,
    } = this.sessions;
    const {
      userObj1,
    } = this.users;

    const thisTestUrl = `${prefix}session/${session5.id}/user`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'PUT',
      payload: userObj1,
      credentials: {
        scope: ['session:findById', 'session:user:create'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.username, userObj1.username);
    assert.equal(result.email, userObj1.email.toLowerCase());
  });
});
