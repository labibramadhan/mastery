import Boom from 'boom';
import _ from 'lodash';

const I18nExtended = requireF('services/_core/I18nExtended');
const PreHandlerValidatorBase404PK = requireF('services/_core/preHandlerValidators/base/PreHandlerValidatorBase404PK');

export default class PreHandlerValidatorBaseOwnPK extends PreHandlerValidatorBase404PK {
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
      if (this.i18nExtended.has(this.ownMessageKey)) {
        message = this.i18nExtended.t(this.ownMessageKey);
      }
      return Boom.forbidden(message);
    }
    return false;
  }

  async validate(request) {
    this.request = request;
    this.i18nExtended = new I18nExtended(this.request);
    return await super.validator() || await this.validator();
  }
}
