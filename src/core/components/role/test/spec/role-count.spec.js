import HttpStatus from 'http-status-codes';
import Qs from 'qs';
import {
  assert,
} from 'chai';

const setup = require('../../../../test/helpers/setup');
const mockUsers = require('../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`role count GET ${prefix}roles/count`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      adminRole,
      authenticatedRole,
    } = this.roles;
    const thisTestUrl = `${prefix}roles/count?${Qs.stringify({
      where: {
        name: {
          $in: [
            adminRole.name,
            authenticatedRole.name,
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
        scope: ['role:count'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.count, 2);
  });
});
