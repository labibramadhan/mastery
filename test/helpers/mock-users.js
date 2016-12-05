export default async function mockUsers() {
  const ModelResolver = requireF('services/_core/resolvers/ModelResolver');
  const modelResolver = new ModelResolver();
  const { user, role } = modelResolver.getModels(['user', 'role']);

  const adminRole = await role.findOne({ where: { name: 'admin' } });
  const authenticatedRole = await role.findOne({ where: { name: 'authenticated' } });

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

    // eslint-disable-next-line no-param-reassign
  this.users = { admin1, admin2, authenticated1, authenticated2 };

    // eslint-disable-next-line no-param-reassign
  this.roles = { adminRole, authenticatedRole };
}
