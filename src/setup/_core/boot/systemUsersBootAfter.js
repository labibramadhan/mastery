const ResolverModels = requireF('services/_core/resolvers/ResolverModels');

export default async () => {
  const resolverModels = new ResolverModels();
  const {
    role,
    user,
  } = resolverModels.getModels(['role', 'user']);

  const anonymousRole = await role.findOrCreate({
    where: {
      name: 'anonymous',
    },
  });

  const anonymousUserExist = await user.count({
    where: {
      username: 'anonymous',
    },
  });
  if (!anonymousUserExist) {
    const anonymousUser = await user.build({
      username: 'anonymous',
      email: ' ',
      password: ' ',
    });
    anonymousUser.save({
      validate: false,
    });
    anonymousUser.addRoles(anonymousRole[0]);
  }
};
