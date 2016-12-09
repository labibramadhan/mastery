import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';
import qs from 'qs';

const setup = require('../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`GET findOne ${prefix}role`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('normal', async () => {
    const thisTestUrl = `${prefix}role?${qs.stringify({
      where: {
        name: {
          $eq: 'admin',
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
        scope: ['role:findOne'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.name, 'admin');
  });
});
