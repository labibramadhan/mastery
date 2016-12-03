const PreHandlerValidatorBaseOwnPK = requireF('services/_core/preHandlerValidators/base/PreHandlerValidatorBaseOwnPK');

export default class PreHandlerValidatorDelete extends PreHandlerValidatorBaseOwnPK {
  constructor(model) {
    super(model);

    this.superPermissions = [`${this.model.name}:delete`];
    this.ownMessageKey = `error.${this.model.name}.own.delete.forbidden`;
  }
}
