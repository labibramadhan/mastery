const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

export default async function mockUsers() {
  const resolverModels = new ResolverModels();
  const { user, role } = resolverModels.getModels(['user', 'role']);

  const adminRole = await role.findOne({ where: { name: 'admin' } });
  const authenticatedRole = await role.findOne({ where: { name: 'authenticated' } });

  const admin1 = await user.create({
    username: 'admin1',
    email: 'admin1@mailinator.com',
    password: 'Asdqwe123',
  });
  await admin1.addRoles([authenticatedRole, adminRole]);

  const admin2 = await user.create({
    username: 'admin2',
    email: 'admin2@mailinator.com',
    password: 'Asdqwe123',
  });
  await admin2.addRoles([authenticatedRole, adminRole]);

  const authenticated1 = await user.create({
    username: 'authenticated1',
    email: 'authenticated1@mailinator.com',
    password: 'Asdqwe123',
  });
  await authenticated1.addRoles(authenticatedRole);

  const authenticated2 = await user.create({
    username: 'authenticated2',
    email: 'authenticated2@mailinator.com',
    password: 'Asdqwe123',
  });
  await authenticated2.addRoles(authenticatedRole);

    // eslint-disable-next-line no-param-reassign
  this.users = { admin1, admin2, authenticated1, authenticated2 };

    // eslint-disable-next-line no-param-reassign
  this.roles = { adminRole, authenticatedRole };
}
