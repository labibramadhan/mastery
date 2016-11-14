import setup from './setup';

export default (test) => {
  setup(test);

  test.beforeEach('User mock data', async (t) => {
    const { sequelize } = t.context;
    const { user } = sequelize.models;

    const user1 = await user.create({
      username: 'user1',
      email: 'user1@mailinator.com',
      password: 'Asdqwe123',
    });

    const user2 = await user.create({
      username: 'user2',
      email: 'user2@mailinator.com',
      password: 'Asdqwe123',
    });

    const user3 = await user.create({
      username: 'user3',
      email: 'user3@mailinator.com',
      password: 'Asdqwe123',
    });

    // eslint-disable-next-line no-param-reassign
    t.context.users = { user1, user2, user3 };
  });
};
