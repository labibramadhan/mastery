import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const setup = require('../../../../test/helpers/setup');
const mockUsers = require('../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`role findById GET ${prefix}role/{pk}`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('works', async function it() {
    const {
      adminRole,
    } = this.roles;

    const thisTestUrl = `${prefix}role/${adminRole.id}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'GET',
      credentials: {
        scope: ['role:findById'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.name, adminRole.name);
  });
});
