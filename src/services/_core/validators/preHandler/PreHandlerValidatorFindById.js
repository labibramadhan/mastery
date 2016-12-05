const PreHandlerValidatorBaseOwnPK = requireF('services/_core/validators/preHandler/base/PreHandlerValidatorBaseOwnPK');

export default class PreHandlerValidatorFindById extends PreHandlerValidatorBaseOwnPK {
  constructor(model) {
    super(model);

    this.superPermissions = [`${this.model.name}:findById`];
    this.ownMessageKey = `error.${this.model.name}.own.findById.forbidden`;
  }
}
