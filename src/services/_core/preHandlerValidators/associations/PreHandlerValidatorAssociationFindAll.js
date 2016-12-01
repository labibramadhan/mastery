import _ from 'lodash';
import Boom from 'boom';

const I18nExtended = requireF('services/_core/I18nExtended');

export default class PreHandlerValidatorAssociationFindAll {
  constructor(model, association) {
    this.model = model;
    this.association = association;
    this.ownerFields = conf.get(`models:${model.name}:ownerFields`);
    this.pk = conf.get(`models:${this.model.name}:pk`);
  }

  notExist = async () => {
    const count = await this.model.count({
      where: {
        [this.pk]: this.request.params.id,
      },
    });
    if (!count) {
      return Boom.notFound();
    }
    return false;
  }

  invalidOwnParent = async () => {
    if (!this.ownerFields ||
      !_.has(this.request, 'auth.credentials.scope') ||
      this.request.auth.credentials.scope.includes(`${this.model.name}:${this.association.as}:findAll`) ||
      this.request.auth.credentials.scope.includes(`${this.model.name}:${this.association.as}:own:findAll`)
    ) {
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
        [this.pk]: this.request.params.id,
        $or: whereOr,
      },
    });
    if (!count) {
      const i18nExtended = new I18nExtended(this.request);
      let message = null;
      const messageKey = `error.${this.model.name}.own.${this.association.as}.findAll.forbidden`;
      if (i18nExtended.has(messageKey)) {
        message = i18nExtended.t(messageKey);
      }
      return Boom.forbidden(message);
    }
    return false;
  }

  validate = async (request) => {
    this.request = request;
    return await this.notExist() || await this.invalidOwnParent();
  }
}
