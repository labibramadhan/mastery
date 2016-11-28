const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

export default async () => {
  if (isTest) return;

  const resolverModels = new ResolverModels();
  const {
    role,
    user,
  } = resolverModels.getModels(['role', 'user']);

  // add a default admin account
  const adminRole = await role.find({
    where: {
      name: 'admin',
    },
  });
  if (adminRole) {
    let defaultAdmin;
    defaultAdmin = await user.find({
      where: {
        username: 'admin',
      },
    });
    if (!defaultAdmin) {
      defaultAdmin = await user.create({
        username: 'admin',
        email: 'admin@mailinator.com',
        password: 'adminpassword',
      });
      await defaultAdmin.addRoles(adminRole);
    }
  }

  // add a default authenticated account
  const authenticatedRole = await role.find({
    where: {
      name: 'authenticated',
    },
  });
  if (authenticatedRole) {
    let defaultAuthenticated;
    defaultAuthenticated = await user.find({
      where: {
        username: 'authenticated',
      },
    });
    if (!defaultAuthenticated) {
      defaultAuthenticated = await user.create({
        username: 'authenticated',
        email: 'authenticated@mailinator.com',
        password: 'authenticatedpassword',
      });
    }
  }
};
