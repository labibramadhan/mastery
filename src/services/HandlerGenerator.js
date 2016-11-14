import Boom from 'boom';

import { parseQueries } from './handlerParser';

export default function (model) {
  this.findAll = async (request, reply) => {
    try {
      const queries = parseQueries(request);
      const results = await model.findAll(queries);
      return reply(results);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  };

  this.count = async (request, reply) => {
    try {
      const queries = parseQueries(request);
      const result = await model.count(queries);
      return reply({ count: result });
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  };

  this.findOne = async (request, reply) => {
    try {
      const queries = parseQueries(request);
      const result = await model.findOne(queries);
      return reply(result);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  };

  this.findById = async (request, reply) => {
    try {
      const result = await model.findById(request.params.id);
      return reply(result);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  };

  this.create = async (request, reply) => {
    try {
      const result = await model.create(request.payload);
      return reply(result);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  };
}
