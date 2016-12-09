import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

const setup = require('../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`POST update ${prefix}role/{pk}`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
    this.modelResolver = new ModelResolver();
  });

  it('works', async function it() {
    const roleModel = this.modelResolver.getModel('role');
    const role1 = await roleModel.create({
      name: 'role1',
    });
    const thisTestUrl = `${prefix}role/${role1.id}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      payload: {
        name: 'role1-updated',
      },
      method: 'POST',
      credentials: {
        scope: ['role:update'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.name, 'role1-updated');
  });
});
