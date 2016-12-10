import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';
import qs from 'qs';

const setup = require('../../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`role associationCount GET ${prefix}role/{pk}/users/count`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      admin1,
      admin2,
    } = this.users;
    const {
      adminRole,
    } = this.roles;

    const thisTestUrl = `${prefix}role/${adminRole.id}/users/count?${qs.stringify({
      where: {
        username: {
          $in: [
            admin1.username,
            admin2.username,
          ],
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
        scope: ['role:findById', 'role:users:count'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.count, 2);
  });
});
