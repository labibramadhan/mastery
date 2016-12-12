import Boom from 'boom';
import _ from 'lodash';

export default class PreAssociationFindValidation {
  constructor(model, association, associatedModel) {
    this.model = model;
    this.association = association;
    this.associatedModel = associatedModel;
    this.ownerFields = conf.get(`models:${model.name}:ownerFields`);
  }

  invalidOwnChild = async () => {
    if (!this.ownerFields ||
      !_.has(this.request, 'auth.credentials.scope') ||
      this.request.auth.credentials.scope.includes(`${this.model.name}:${this.association.as}:find`) ||
      this.request.auth.credentials.scope.includes(`${this.model.name}:own:${this.association.as}:find`)
    ) {
      return false;
    }

    const parent = await this.model.findById(this.request.params.pk);
    const child = await parent[this.association.accessors.get]();
    const invalid = _.filter(this.ownerFields, field =>
      child[field] !== this.request.auth.credentials.id).length;

    if (invalid) {
      let message = null;
      const messageKey = `error.${this.model.name}.own.${this.association.as}.own.find.forbidden`;
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
