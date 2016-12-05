import Boom from 'boom';

const HandlerErrorFormatter = requireF('services/_core/formatters/HandlerErrorFormatter');

export default class HandlerGeneratorBase {
  constructor(model, association) {
    this.model = model;
    this.association = association;
  }

  handler = async (request, reply) => {
    try {
      return await this.query(request, reply);
    } catch (e) {
      const handlerErrorFormatter = new HandlerErrorFormatter(request);
      return reply(Boom.badRequest(handlerErrorFormatter.format(e)));
    }
  }
}
