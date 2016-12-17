const ModelResolver = requireF('core/services/resolvers/ModelResolver');

export default async () => {
  if (!isMaster) return;

  const modelResolver = new ModelResolver();
  const role = modelResolver.getModel('role');

  // retrieve all available roles
  const availableRoles = server.plugins['package-acl'];
  const availableRolesNames = Object.keys(availableRoles);

  // loop each roles name
  for (const roleName of availableRolesNames) { // eslint-disable-line no-restricted-syntax
    // check if this role name already persists in database
    await role.findOrCreate({
      where: {
        name: roleName,
      },
    });
  }
};
