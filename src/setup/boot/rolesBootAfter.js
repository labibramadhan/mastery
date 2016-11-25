const {
  getPackage,
  getModel,
} = requireF('services/_core/commonServices');

export default async () => {
  const role = getModel('role');

  // retrieve all available roles
  const availableRoles = server.plugins[`${getPackage().name}-acl`];
  const availableRolesNames = Object.keys(availableRoles);

  // loop each roles name
  for (const roleName of availableRolesNames) { // eslint-disable-line no-restricted-syntax
    // check if this role name already persists in database
    const roleExists = await role.findOne({
      where: {
        name: roleName,
      },
    });
    if (!roleExists) {
      // if not, insert a new one
      await role.create({
        name: roleName,
      });
    }
  }
};
