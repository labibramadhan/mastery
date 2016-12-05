import HttpStatus from 'http-status-codes';

const HandlerGeneratorBase = requireF('services/_core/generators/handler/HandlerGeneratorBase');

export default class HandlerGeneratorDelete extends HandlerGeneratorBase {
  query = async (request, reply) => {
    await this.model.destroy({
      where: {
        [this.model.primaryKeyField]: request.params.id,
      },
    });
    return reply().code(HttpStatus.NO_CONTENT);
  }
}
