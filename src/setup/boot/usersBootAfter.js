const {
  getModels,
} = requireF('services/_core/commonServices');

export default async () => {
  const {
    role,
    user,
  } = getModels(['role', 'user']);

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
        email: 'admin101@mailinator.com',
        password: 'adminpassword',
      });
      await defaultAdmin.addRoles(adminRole);
    }
  }
};
