import _ from 'lodash';
import Boom from 'boom';

export default class PreFindOneValidation {
  constructor(model) {
    this.model = model;
    this.ownerFields = conf.get(`models:${model.name}:ownerFields`);
  }

  notExist = async () => {
    const count = await this.model.count(this.request.queryAPI);
    if (!count) {
      return Boom.notFound();
    }
    return false;
  }

  invalidOwn = async () => {
    if (!this.ownerFields || !_.has(this.request, 'auth.credentials.scope') || this.request.auth.credentials.scope.includes(`${this.model.name}:findOne`)) {
      return false;
    }
    return false;
  }

  validate = async (request) => {
    this.request = request;
    return await this.notExist() || await this.invalidOwn();
  }
}
