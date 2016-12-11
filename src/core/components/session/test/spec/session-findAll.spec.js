import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';
import qs from 'qs';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

const setup = require('../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`session findAll GET ${prefix}sessions`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    this.modelResolver = new ModelResolver();
  });

  it('works', async function it() {
    const {
      authenticated1,
      authenticated2,
    } = this.users;

    const sessionModel = this.modelResolver.getModel('session');
    const session1 = await sessionModel.create({
      userId: authenticated1.id,
      token: 'TEST1',
      platform: 'TEST1',
      expiry: 12345,
    });
    const session2 = await sessionModel.create({
      userId: authenticated2.id,
      token: 'TEST2',
      platform: 'TEST2',
      expiry: 12345,
    });

    const thisTestUrl = `${prefix}sessions?${qs.stringify({
      include: {
        model: 'user',
        where: {
          username: {
            $or: {
              $in: [
                authenticated1.username,
                authenticated2.username,
              ],
            },
          },
        },
      },
      order: [
        {
          model: 'user',
          field: 'username',
          sort: 'DESC',
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
        scope: ['session:findAll'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result[0].id, session2.id);
    assert.equal(result[0].userId, authenticated2.id);
    assert.equal(result[0].user.username, authenticated2.username);
    assert.equal(result[1].id, session1.id);
    assert.equal(result[1].userId, authenticated1.id);
    assert.equal(result[1].user.username, authenticated1.username);
  });
});
