const PreHandlerValidatorBaseOwnPK = requireF('services/_core/validators/preHandler/base/PreHandlerValidatorBaseOwnPK');

export default class PreHandlerValidatorUpdate extends PreHandlerValidatorBaseOwnPK {
  constructor(model) {
    super(model);

    this.superPermissions = [`${this.model.name}:update`];
    this.ownMessageKey = `error.${this.model.name}.own.update.forbidden`;
  }
}
