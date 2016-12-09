import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';
import qs from 'qs';

const setup = require('../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`GET findAll ${prefix}users`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      admin2,
    } = this.users;
    const {
      adminRole,
    } = this.roles;

    const thisTestUrl = `${prefix}users?${qs.stringify({
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
    }).toString()}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'GET',
      credentials: {
        scope: ['user:findAll'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.length, 3);
    assert.equal(result[0].id, admin2.id);
    assert.equal(result[0].roles.length, 2);
    assert.equal(result[0].roles[0].id, adminRole.id);
    assert.equal(result[0].roles[0].users.length, 2);
  });
});
