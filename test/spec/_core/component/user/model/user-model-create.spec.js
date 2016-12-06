import { assert } from 'chai';
import setup from '../../../../../helpers/setup';

const ModelResolver = requireF('core/services/resolvers/ModelResolver');

describe('create a user', () => {
  before(async function before() {
    await setup();
    this.modelResolver = new ModelResolver();
  });

  it('created', async function it() {
    const user = this.modelResolver.getModel('user');

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
