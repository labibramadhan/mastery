const ModelResolver = requireF('services/_core/resolvers/ModelResolver');

export default async () => {
  const modelResolver = new ModelResolver();
  const {
    role,
    user,
  } = modelResolver.getModels(['role', 'user']);

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
    anonymousUser.addRole(anonymousRole[0]);
  }
};
