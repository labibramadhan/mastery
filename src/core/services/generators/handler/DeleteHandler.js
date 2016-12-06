import HttpStatus from 'http-status-codes';

const BaseHandler = requireF('core/services/generators/handler/BaseHandler');

export default class DeleteHandler extends BaseHandler {
  query = async (request, reply) => {
    await this.model.destroy({
      where: {
        [this.model.primaryKeyField]: request.params.id,
      },
    });
    return reply().code(HttpStatus.NO_CONTENT);
  }
}
