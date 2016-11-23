const { loginJWT, parseCredentials } = requireF('services/_core/authJWTServices');

export default async (request, reply) => {
  const credentials = parseCredentials(request.payload);
  const login = await loginJWT(credentials);

  return reply(login);
};
