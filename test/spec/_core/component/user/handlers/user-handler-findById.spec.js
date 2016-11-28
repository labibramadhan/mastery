import URI from 'urijs';
import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

import setup from '../../../../../helpers/setup';
import mockUsers from '../../../../../helpers/mock-users';

const prefix = conf.get('prefix');

describe(`GET findById ${prefix}user/{id}`, () => {
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
    const { authenticated2 } = this.users;

    const thisTestUrl = URI(`${prefix}user/${authenticated2.id}`).addQuery({ token: this.token }).toString();

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'GET',
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.id, authenticated2.id);
  });
});
