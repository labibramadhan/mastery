import _ from 'lodash';

export default class PreHandlerValidatorAssociationCount {
  constructor(model, association) {
    this.model = model;
    this.association = association;
    this.ownerFields = conf.get(`models:${model.name}:ownerFields`);
    this.pk = conf.get(`models:${this.model.name}:pk`);
  }

  invalidOwnChild = async () => {
    if (!this.ownerFields ||
      !_.has(this.request, 'auth.credentials.scope') ||
      this.request.auth.credentials.scope.includes(`${this.model.name}:${this.association.as}:count`) ||
      this.request.auth.credentials.scope.includes(`${this.model.name}:${this.association.as}:own:count`)
    ) {
      return false;
    }
    return false;
  }

  validate = async (request) => {
    this.request = request;
    return await this.invalidOwnChild();
  }
}
