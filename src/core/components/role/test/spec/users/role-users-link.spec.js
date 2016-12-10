import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

const setup = require('../../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`role link PUT ${prefix}role/{pk}/users/link/{pk2}`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    this.modelResolver = new ModelResolver();
  });

  it('works', async function it() {
    const {
      admin2,
    } = this.users;

    const roleModel = this.modelResolver.getModel('role');
    const role1 = await roleModel.create({
      name: 'role1',
    });
    const thisTestUrl = `${prefix}role/${role1.id}/users/link/${admin2.id}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'PUT',
      credentials: {
        scope: ['role:findById', 'role:users:link'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.roleId, role1.id);
    assert.equal(result.userId, admin2.id);
  });
});
