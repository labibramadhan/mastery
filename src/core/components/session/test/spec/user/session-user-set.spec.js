import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');
const mockSessions = require('../../../../../test/helpers/mock-sessions');

const prefix = conf.get('prefix');

describe(`session associationSet POST ${prefix}session/{pk}/user/set/{pk2}`, () => {
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
      authenticated1,
    } = this.users;

    const thisTestUrl = `${prefix}session/${session5.id}/user/set/${authenticated1.id}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'POST',
      credentials: {
        scope: ['session:findById', 'session:user:set'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.username, authenticated1.username);
    assert.equal(result.email, authenticated1.email);
  });
});
