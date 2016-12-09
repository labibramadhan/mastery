import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

const setup = require('../../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`PUT link ${prefix}user/{pk}/roles/link/{pk2}`, () => {
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
    const thisTestUrl = `${prefix}user/${admin2.id}/roles/link/${role1.id}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'PUT',
      credentials: {
        scope: ['user:findById', 'user:roles:link'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.roleId, role1.id);
    assert.equal(result.userId, admin2.id);
  });
});
