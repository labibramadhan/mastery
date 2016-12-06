import _ from 'lodash';

export default class PreCountValidation {
  constructor(model) {
    this.model = model;
    this.ownerFields = conf.get(`models:${model.name}:ownerFields`);
  }

  validateOwn = async () => {
    if (!this.ownerFields || !_.has(this.request, 'auth.credentials.scope') || this.request.auth.credentials.scope.includes(`${this.model.name}:count`)) {
      return true;
    }
    return true;
  }

  validate = async (request) => {
    this.request = request;
    return await this.validateOwn();
  }
}
