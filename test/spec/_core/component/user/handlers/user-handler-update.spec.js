import HttpStatus from 'http-status-codes';
import URI from 'urijs';
import {
  assert,
} from 'chai';
import qs from 'qs';

const setup = require('../../../../../helpers/setup');
const mockUsers = require('../../../../../helpers/mock-users');

const prefix = conf.get('prefix');

describe(`POST update ${prefix}user/{pk}`, () => {
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
      admin1,
    } = this.users;

    const thisTestUrl = URI(`${prefix}user/${admin1.id}`).query(qs.stringify({
      token: this.token,
    })).toString();

    const userObj = {
      username: 'admin1updated',
      email: 'admin1updated@mailinator.com',
    };

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'POST',
      payload: userObj,
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.username, userObj.username);
    assert.equal(result.email, userObj.email);
  });
});
