const AuthJWTLogin = requireF('services/_core/authentications/jwt/AuthJWTLogin');

export default class UserHandlerLogin {
  constructor() {
    this.authJWTLogin = new AuthJWTLogin();
  }

  handler = async (request, reply) => {
    this.authJWTLogin.payload = request.payload;
    const login = await this.authJWTLogin.login();

    return reply(login);
  }
}
