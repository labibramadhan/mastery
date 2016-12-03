import HttpStatus from 'http-status-codes';
import URI from 'urijs';
import {
  assert,
} from 'chai';
import qs from 'qs';

const setup = require('../../../../../helpers/setup');
const mockUsers = require('../../../../../helpers/mock-users');

const prefix = conf.get('prefix');

describe(`GET findAll ${prefix}users`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();

    const {
      admin1,
    } = this.users;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: `${prefix}user/login`,
      method: 'POST',
      payload: {
        username: admin1.username,
        password: 'Asdqwe123',
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.isString(result.token);

    this.token = result.token;
  });

  it('works', async function it() {
    const {
      admin2,
    } = this.users;
    const {
      adminRole,
    } = this.roles;

    const thisTestUrl = URI(`${prefix}users`).query(qs.stringify({
      where: {
        username: {
          $not: 'admin1',
        },
      },
      include: {
        model: 'role',
        where: {
          $or: [{
            name: 'admin',
          }, {
            name: 'authenticated',
          }],
        },
        include: {
          model: 'user',
        },
      },
      order: [
        'username asc', {
          model: 'role',
          field: 'name',
          sort: 'asc',
        },
      ],
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
    assert.equal(result.length, 3);
    assert.equal(result[0].id, admin2.id);
    assert.equal(result[0].roles.length, 2);
    assert.equal(result[0].roles[0].id, adminRole.id);
    assert.equal(result[0].roles[0].users.length, 2);
  });
});
