export default class PreHandlerValidatorFindOne {
  constructor(model) {
    this.model = model;
    this.ownerFields = conf.get(`models:${model.name}:ownerFields`);
    this.pk = conf.get(`models:${this.model.name}:pk`);
  }

  validateOwn = async () => {
    if (!this.ownerFields || this.request.auth.credentials.scope.includes(`${this.model.name}:findOne`)) {
      return true;
    }
    return true;
  }

  validate = async (request) => {
    this.request = request;
    return await this.validateOwn();
  }
}
