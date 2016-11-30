import _ from 'lodash';
import Boom from 'boom';

const I18nExtended = requireF('services/_core/I18nExtended');

export default class PreHandlerValidatorFindById {
  constructor(model) {
    this.model = model;
    this.ownerFields = conf.get(`models:${model.name}:ownerFields`);
    this.pk = conf.get(`models:${this.model.name}:pk`);
  }

  validateOwn = async () => {
    if (!this.ownerFields || this.request.auth.credentials.scope.includes(`${this.model.name}:findById`)) {
      return true;
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
        [this.pk]: this.request.params.id,
        $or: whereOr,
      },
    });
    if (!count) {
      const i18nExtended = new I18nExtended(this.request);
      let message = null;
      const messageKey = `error.${this.model.name}.findById.own.forbidden`;
      if (i18nExtended.has(messageKey)) {
        message = i18nExtended.t(messageKey);
      }
      return Boom.forbidden(message);
    }
    return true;
  }

  validate = async (request) => {
    this.request = request;
    return await this.validateOwn();
  }
}
