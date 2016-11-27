const {
  loginJWT,
  parseCredentials,
} = requireF('services/_core/authentications/authJWTServices');

export default class UserHandlerLogin {
  handler = async (request, reply) => {
    const credentials = parseCredentials(request.payload);
    const login = await loginJWT(credentials);

    return reply(login);
  }
}
