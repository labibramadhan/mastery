import HttpStatus from 'http-status-codes';
import URI from 'urijs';
import {
  assert,
} from 'chai';
import qs from 'qs';

const setup = require('../../../../../helpers/setup');
const mockUsers = require('../../../../../helpers/mock-users');

const prefix = conf.get('prefix');

describe(`GET findAllOneToMany ${URI(`${prefix}user/{pk}/roles`).addQuery({
  name: 'admin',
})}`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();

    const {
      admin2,
    } = this.users;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: `${prefix}user/login`,
      method: 'POST',
      payload: {
        username: admin2.username,
        password: 'Asdqwe123',
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.isString(result.token);

    this.token = result.token;
  });

  it('works', async function it() {
    const { admin2 } = this.users;
    const { adminRole } = this.roles;

    const thisTestUrl = URI(`${prefix}user/${admin2.id}/roles`).query(qs.stringify({
      where: { name: 'admin' },
      token: this.token,
    })).toString();

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'GET',
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, adminRole.id);
  });
});
