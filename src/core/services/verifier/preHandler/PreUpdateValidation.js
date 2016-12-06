const PreOwnPKValidationBase = requireF('core/services/verifier/preHandler/base/PreOwnPKValidationBase');

export default class PreUpdateValidation extends PreOwnPKValidationBase {
  constructor(model) {
    super(model);

    this.superPermissions = [`${this.model.name}:update`];
    this.ownMessageKey = `error.${this.model.name}.own.update.forbidden`;
  }
}
