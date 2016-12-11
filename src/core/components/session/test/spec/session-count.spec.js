import HttpStatus from 'http-status-codes';
import Qs from 'qs';
import {
  assert,
} from 'chai';

const setup = require('../../../../test/helpers/setup');
const mockUsers = require('../../../../test/helpers/mock-users');
const mockSessions = require('../../../../test/helpers/mock-sessions');

const prefix = conf.get('prefix');

describe(`session count GET ${prefix}sessions/count`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    await mockSessions.bind(this).apply();
  });

  it('works', async function it() {
    const {
      authenticated1,
      admin2,
    } = this.users;

    const thisTestUrl = `${prefix}sessions/count?${Qs.stringify({
      include: {
        model: 'user',
        where: {
          username: {
            $or: {
              $in: [
                authenticated1.username,
                admin2.username,
              ],
            },
          },
        },
      },
    }).toString()}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'GET',
      credentials: {
        scope: ['session:count'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.count, 2);
  });
});
