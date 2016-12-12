import _ from 'lodash';

export default async function mockUsers() {
  const ModelResolver = requireF('core/services/resolvers/ModelResolver');
  const modelResolver = new ModelResolver();
  const {
    user,
    role,
  } = modelResolver.getModels(['user', 'role']);

  const adminRole = await role.findOne({
    where: {
      name: 'admin',
    },
  });
  const authenticatedRole = await role.findOne({
    where: {
      name: 'authenticated',
    },
  });

  const admin1 = await user.create({
    username: 'admin1',
    email: 'admin1@mailinator.com',
    password: 'Asdqwe123',
  });
  await admin1.addRole(adminRole);

  const admin2 = await user.create({
    username: 'admin2',
    email: 'admin2@mailinator.com',
    password: 'Asdqwe123',
  });
  await admin2.addRole(adminRole);

  const authenticated1 = await user.create({
    username: 'authenticated1',
    email: 'authenticated1@mailinator.com',
    password: 'Asdqwe123',
  });

  const authenticated2 = await user.create({
    username: 'authenticated2',
    email: 'authenticated2@mailinator.com',
    password: 'Asdqwe123',
  });

  const userObj1 = {
    username: 'userObj1',
    email: 'userObj1@mailinator.com',
    password: 'userObj1password',
  };

  const userObj2 = {
    username: 'userObj2',
    email: 'userObj2@mailinator.com',
    password: 'userObj2password',
  };

  const userObj3 = {
    username: 'userObj3',
    email: 'userObj3@mailinator.com',
    password: 'userObj3password',
  };

  const userObj4 = {
    username: 'userObj4',
    email: 'userObj4@mailinator.com',
    password: 'userObj4password',
  };

  // eslint-disable-next-line no-param-reassign
  this.users = {
    admin1,
    admin2,
    authenticated1,
    authenticated2,
    userObj1,
    userObj2,
    userObj3,
    userObj4,
  };

  // eslint-disable-next-line no-param-reassign
  this.roles = _.merge(this.roles || {}, {
    adminRole,
    authenticatedRole,
  });
}
