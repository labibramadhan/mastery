import test from 'ava';
import setup from '../helpers/setup';

setup(test);

test('Create a user', async (t) => {
  const { sequelize } = t.context;
  const { user } = sequelize.models;
  const userObj = {
    username: 'user',
    email: 'user@mailinator.com',
    password: 'Asdqwe123',
  };
  const userInstance = await user.create(userObj);
  t.is(userInstance.username, userObj.username);
  t.is(userInstance.email, userObj.email);
});
