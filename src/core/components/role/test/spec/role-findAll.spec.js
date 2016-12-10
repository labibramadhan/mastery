import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';
import qs from 'qs';

const setup = require('../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`role findAll GET ${prefix}roles`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      adminRole,
      authenticatedRole,
    } = this.roles;
    const thisTestUrl = `${prefix}roles?${qs.stringify({
      where: {
        name: {
          $or: {
            $in: [
              adminRole.name,
              authenticatedRole.name,
            ],
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
        scope: ['role:findAll'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.length, 2);
    assert.equal(result[0].id, adminRole.id);
    assert.equal(result[1].id, authenticatedRole.id);
  });
});
