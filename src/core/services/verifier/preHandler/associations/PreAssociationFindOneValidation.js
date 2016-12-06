import Boom from 'boom';
import _ from 'lodash';

export default class PreAssociationFindOneValidation {
  constructor(model, association) {
    this.model = model;
    this.association = association;
    this.ownerFields = conf.get(`models:${model.name}:ownerFields`);
  }

  invalidOwnChild = async () => {
    if (!this.ownerFields ||
      !_.has(this.request, 'auth.credentials.scope') ||
      this.request.auth.credentials.scope.includes(`${this.model.name}:${this.association.as}:findOne`) ||
      this.request.auth.credentials.scope.includes(`${this.model.name}:own:${this.association.as}:findOne`)
    ) {
      return false;
    }

    const parent = await this.model.findById(this.request.params.pk);
    const child = await parent[this.association.accessors.get]();
    const invalid = _.filter(this.ownerFields, field =>
      child[field] !== this.request.auth.credentials.id).length;

    if (invalid) {
      let message = null;
      const messageKey = `error.${this.model.name}.own.${this.association.as}.own.findOne.forbidden`;
      if (this.request.t.has(messageKey)) {
        message = this.request.t(messageKey);
      }
      return Boom.forbidden(message);
    }
    return false;
  }

  validate = async (request) => {
    this.request = request;
    return await await this.invalidOwnChild();
  }
}
