import { assert } from 'chai';
import setup from '../../../../../helpers/setup';

const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

describe('create a user', () => {
  before(async function before() {
    await setup();
    this.resolverModels = new ResolverModels();
  });

  it('created', async function it() {
    const user = this.resolverModels.getModel('user');

    const userObj = {
      username: 'user',
      email: 'user@mailinator.com',
      password: 'Asdqwe123',
    };

    const userInstance = await user.create(userObj);

    assert.isObject(userInstance);
    assert.equal(userInstance.username, userObj.username);
    assert.equal(userInstance.email, userObj.email);
    assert.isTrue(userInstance.validPassword(userObj.password));
  });
});
