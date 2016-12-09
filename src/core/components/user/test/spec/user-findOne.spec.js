import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';
import qs from 'qs';

const setup = require('../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`GET findOne ${prefix}user`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      authenticated2,
    } = this.users;
    const {
      authenticatedRole,
    } = this.roles;

    const thisTestUrl = `${prefix}user?${qs.stringify({
      where: {
        username: 'authenticated2',
      },
      include: JSON.stringify({
        model: 'role',
      }),
    }).toString()}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'GET',
      credentials: {
        scope: ['user:findOne'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.id, authenticated2.id);
    assert.equal(result.roles[0].id, authenticatedRole.id);
  });
});
