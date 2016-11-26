import { assert } from 'chai';
import setup from '../../../../../helpers/setup';

const {
  getModel,
} = requireF('services/_core/commonServices');

describe('create a user', () => {
  before(async () => {
    await setup();
  });

  it('created', async () => {
    const user = getModel('user');

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
