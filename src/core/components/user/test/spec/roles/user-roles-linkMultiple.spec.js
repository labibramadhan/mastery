import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

const setup = require('../../../../../test/helpers/setup');
const mockUsers = require('../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`user linkMultiple PUT ${prefix}user/{pk}/roles/link`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    this.modelResolver = new ModelResolver();
  });

  it('works', async function it() {
    const {
      authenticated1,
    } = this.users;
    const {
      adminRole,
    } = this.roles;

    const roleModel = this.modelResolver.getModel('role');
    const role1 = await roleModel.create({
      name: 'role1',
    });
    const thisTestUrl = `${prefix}user/${authenticated1.id}/roles/link`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'PUT',
      payload: [
        adminRole.id,
        role1.id,
      ],
      credentials: {
        scope: ['user:findById', 'user:roles:linkMultiple'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result[0].roleId, adminRole.id);
    assert.equal(result[0].userId, authenticated1.id);
    assert.equal(result[1].roleId, role1.id);
    assert.equal(result[1].userId, authenticated1.id);
  });
});
