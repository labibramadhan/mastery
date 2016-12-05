import Boom from 'boom';
import _ from 'lodash';

const Pre404PKValidationBase = requireF('services/_core/verifier/preHandler/base/Pre404PKValidationBase');

export default class PreOwnPKValidationBase extends Pre404PKValidationBase {
  constructor(model) {
    super(model);
    this.model = model;
    this.ownerFields = conf.get(`models:${model.name}:ownerFields`);
    this.superValidate = super.validate;
  }

  async validator() {
    if (!this.ownerFields ||
      !_.has(this.request, 'auth.credentials.scope') ||
      _.intersection(this.request.auth.credentials.scope, this.superPermissions).length) {
      return false;
    }
    const whereOr = [];
    const ownerFields = _.castArray(this.ownerFields);
    _.forEach(ownerFields, (ownerField) => {
      whereOr.push({
        [ownerField]: this.request.auth.credentials.id,
      });
    });
    const count = await this.model.count({
      where: {
        [this.model.primaryKeyField]: this.request.params.pk,
        $or: whereOr,
      },
    });
    if (!count) {
      let message = null;
      if (this.request.t.has(this.ownMessageKey)) {
        message = this.request.t(this.ownMessageKey);
      }
      return Boom.forbidden(message);
    }
    return false;
  }

  async validate(request) {
    this.request = request;
    return await super.validator() || await this.validator();
  }
}
