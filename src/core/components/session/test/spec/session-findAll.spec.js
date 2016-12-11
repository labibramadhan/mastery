import HttpStatus from 'http-status-codes';
import Qs from 'qs';
import {
  assert,
} from 'chai';

const setup = require('../../../../test/helpers/setup');
const mockUsers = require('../../../../test/helpers/mock-users');
const mockSessions = require('../../../../test/helpers/mock-sessions');

const prefix = conf.get('prefix');

describe(`session findAll GET ${prefix}sessions`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    await mockSessions.bind(this).apply();
  });

  it('works', async function it() {
    const {
      authenticated1,
      authenticated2,
    } = this.users;
    const {
      session1,
      session2,
    } = this.sessions;

    const thisTestUrl = `${prefix}sessions?${Qs.stringify({
      include: {
        model: 'user',
        where: {
          username: {
            $or: {
              $in: [
                authenticated1.username,
                authenticated2.username,
              ],
            },
          },
        },
      },
      order: [
        {
          model: 'user',
          field: 'username',
          sort: 'DESC',
        },
      ],
    }).toString()}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'GET',
      credentials: {
        scope: ['session:findAll'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result[0].id, session2.id);
    assert.equal(result[0].userId, authenticated2.id);
    assert.equal(result[0].user.username, authenticated2.username);
    assert.equal(result[1].id, session1.id);
    assert.equal(result[1].userId, authenticated1.id);
    assert.equal(result[1].user.username, authenticated1.username);
  });
});
