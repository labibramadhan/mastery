const PreOwnPKValidationBase = requireF('core/services/verifier/preHandler/base/PreOwnPKValidationBase');

export default class PreFindByIdValidation extends PreOwnPKValidationBase {
  constructor(model) {
    super(model);

    this.superPermissions = [`${this.model.name}:findById`];
    this.ownMessageKey = `error.${this.model.name}.own.findById.forbidden`;
  }
}
