const PreOwnPKValidationBase = requireF('services/_core/verifier/preHandler/base/PreOwnPKValidationBase');

export default class PreDeleteValidation extends PreOwnPKValidationBase {
  constructor(model) {
    super(model);

    this.superPermissions = [`${this.model.name}:delete`];
    this.ownMessageKey = `error.${this.model.name}.own.delete.forbidden`;
  }
}
