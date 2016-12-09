import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

const setup = require('../../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`PUT linkMultiple ${prefix}role/{pk}/users/link`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    this.modelResolver = new ModelResolver();
  });

  it('works', async function it() {
    const {
      admin1,
      admin2,
    } = this.users;

    const roleModel = this.modelResolver.getModel('role');
    const role1 = await roleModel.create({
      name: 'role1',
    });
    const thisTestUrl = `${prefix}role/${role1.id}/users/link`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'PUT',
      payload: [
        admin1.id,
        admin2.id,
      ],
      credentials: {
        scope: ['role:findById', 'role:users:linkMultiple'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result[0].roleId, role1.id);
    assert.equal(result[0].userId, admin1.id);
    assert.equal(result[1].roleId, role1.id);
    assert.equal(result[1].userId, admin2.id);
  });
});
