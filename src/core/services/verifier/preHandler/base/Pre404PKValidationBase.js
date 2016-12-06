import Boom from 'boom';

export default class Pre404PKValidationBase {
  async validator() {
    const count = await this.model.count({
      where: {
        [this.model.primaryKeyField]: this.request.params.pk,
      },
    });
    if (!count) {
      return Boom.notFound();
    }
    return false;
  }

  async validate() {
    return await super.validator();
  }
}
