const AuthJWTLogin = requireF('core/services/authentications/jwt/AuthJWTLogin');

export default class UserHandlerLogin {
  constructor() {
    this.authJWTLogin = new AuthJWTLogin();
  }

  handler = async (request, reply) => {
    this.authJWTLogin.request = request;
    const login = await this.authJWTLogin.login();

    return reply(login);
  }
}
