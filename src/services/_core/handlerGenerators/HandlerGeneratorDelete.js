import Boom from 'boom';
import HttpStatus from 'http-status-codes';

const HandlerErrorFormatter = requireF('services/_core/HandlerErrorFormatter');

export default class HandlerGeneratorDelete {
  constructor(model) {
    this.model = model;
  }

  handler = async (request, reply) => {
    try {
      await this.model.destroy({
        where: {
          [this.model.primaryKeyField]: request.params.id,
        },
      });
      return reply().code(HttpStatus.NO_CONTENT);
    } catch (e) {
      const handlerErrorFormatter = new HandlerErrorFormatter(request);
      return reply(Boom.badRequest(handlerErrorFormatter.format(e)));
    }
  }
}
