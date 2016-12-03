import Boom from 'boom';

const HandlerErrorFormatter = requireF('services/_core/HandlerErrorFormatter');

export default class HandlerGeneratorUpdate {
  constructor(model) {
    this.model = model;
  }

  handler = async (request, reply) => {
    try {
      const result = await this.model.findById(request.params.pk);
      result.update(request.payload);
      return reply(result.toJSON());
    } catch (e) {
      const handlerErrorFormatter = new HandlerErrorFormatter(request);
      return reply(Boom.badRequest(handlerErrorFormatter.format(e)));
    }
  }
}
