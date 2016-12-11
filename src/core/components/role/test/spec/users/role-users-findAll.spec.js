import HttpStatus from 'http-status-codes';
import Qs from 'qs';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`role associationFindAll GET ${prefix}role/{pk}/users`, () => {
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

    const thisTestUrl = `${prefix}role/${adminRole.id}/users?${Qs.stringify({
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
        scope: ['role:findById', 'role:users:findAll'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, admin1.id);
    assert.equal(result[1].id, admin2.id);
  });
});
