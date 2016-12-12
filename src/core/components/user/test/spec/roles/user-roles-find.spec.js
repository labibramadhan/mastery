import HttpStatus from 'http-status-codes';
import Qs from 'qs';
import {
  assert,
} from 'chai';

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`user associationFind GET ${prefix}user/{pk}/roles`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const { admin2 } = this.users;
    const { adminRole } = this.roles;

    const thisTestUrl = `${prefix}user/${admin2.id}/roles?${Qs.stringify({
      where: { name: adminRole.name },
    }).toString()}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'GET',
      credentials: {
        scope: ['user:findById', 'user:roles:find'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, adminRole.id);
  });
});
