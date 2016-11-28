import URI from 'urijs';
import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

import setup from '../../../../../helpers/setup';
import mockUsers from '../../../../../helpers/mock-users';

const prefix = conf.get('prefix');

describe(`PUT create ${prefix}user`, () => {
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
    const thisTestUrl = URI(`${prefix}user`).addQuery({
      token: this.token,
    }).toString();

    const userObj = {
      username: 'admin0',
      email: 'admin0@mailinator.com',
      password: 'admin0password',
    };

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'PUT',
      payload: userObj,
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.username, userObj.username);
    assert.equal(result.email, userObj.email);
  });
});
