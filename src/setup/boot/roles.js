import { getPackage } from '../../services/commonServices';

export default async (server) => {
  const { models } = server.plugins['hapi-sequelize'].db;

  // retrieve all available roles
  const availableRoles = server.plugins[`${getPackage().name}-roles`];
  const availableRolesNames = Object.keys(availableRoles);

  // loop each roles name
  for (const roleName of availableRolesNames) {
    // check if this role name already persists in database
    const roleExists = await models.role.findOne({ where: { name: roleName } });
    if (!roleExists) {
      // if not, insert a new one
      await models.role.create({ name: roleName });
    }
  }
};
