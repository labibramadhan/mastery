export default async (server) => {
  const { models } = server.plugins['hapi-sequelize'].db;

  // add a default admin account
  const adminRole = await models.role.find({ where: { name: 'admin' } });
  if (adminRole) {
    let defaultAdmin;
    defaultAdmin = await models.user.find({ where: { username: 'admin' } });
    if (!defaultAdmin) {
      defaultAdmin = await models.user.create({
        username: 'admin',
        email: 'admin101@mailinator.com',
        password: 'adminpassword',
      });
      await defaultAdmin.addRoles(adminRole);
    }
  }
};
