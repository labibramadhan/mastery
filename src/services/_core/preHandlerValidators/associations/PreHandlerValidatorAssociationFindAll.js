import _ from 'lodash';

export default class PreHandlerValidatorAssociationFindAll {
  constructor(model, association) {
    this.model = model;
    this.association = association;
    this.ownerFields = conf.get(`models:${model.name}:ownerFields`);
  }

  invalidOwnChild = async () => {
    if (!this.ownerFields ||
      !_.has(this.request, 'auth.credentials.scope') ||
      this.request.auth.credentials.scope.includes(`${this.model.name}:${this.association.as}:findAll`) ||
      this.request.auth.credentials.scope.includes(`${this.model.name}:${this.association.as}:own:findAll`)
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
