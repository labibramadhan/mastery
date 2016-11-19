import _ from 'lodash';
import Boom from 'boom';
import Joi from 'joi';

const queryParsers = requireF('services/core/queryParsers').default;

export const handlerFindAll = (model, componentId) => {
  const handler = async (request, reply) => {
    try {
      const queries = await queryParsers(request, 'findAll');
      const results = await model.findAll(queries);
      return reply(results);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  };
  const permissions = [`${componentId}:findAll`];
  return { handler, permissions };
};

export const handlerCount = (model, componentId) => {
  const handler = async (request, reply) => {
    try {
      const queries = await queryParsers(request, 'count');
      const result = await model.count(queries);
      return reply({ count: result });
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  };
  const permissions = [`${componentId}:count`];
  return { handler, permissions };
};

export const handlerFindOne = (model, componentId) => {
  const handler = async (request, reply) => {
    try {
      const queries = await queryParsers(request, 'findOne');
      const result = await model.findOne(queries);
      return reply(result);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  };
  const permissions = [`${componentId}:findOne`];
  return { handler, permissions };
};

export const handlerFindById = (model, componentId) => {
  const handler = async (request, reply) => {
    try {
      const result = await model.findById(request.params.id);
      return reply(result);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  };
  const permissions = [`${componentId}:findById`];
  return { handler, permissions };
};

export const handlerCreate = (model, componentId) => {
  const handler = async (request, reply) => {
    try {
      const result = await model.create(request.payload);
      return reply(result);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  };
  const permissions = [`${componentId}:create`];
  return { handler, permissions };
};

export const handlerAssociationFindAll = (model, componentId, association) => {
  const handler = async (request, reply) => {
    try {
      const modelInstance = await model.findById(request.params.id);
      const queries = await queryParsers(request, `association${association.associationType}`);
      const expectedMethodName = `get${_.upperFirst(_.camelCase(association.as))}`;
      const results = await modelInstance[expectedMethodName](queries);
      return reply(results);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  };
  const permissions = [`${componentId}:${association.as}:findAll`];
  return { handler, permissions };
};

export const handlerAssociationFindOne = (model, componentId, association) => {
  const handler = async (request, reply) => {
    try {
      const modelInstance = await model.findById(request.params.id);
      const expectedMethodName = `get${_.upperFirst(_.camelCase(association.as))}`;
      const result = await modelInstance[expectedMethodName]();
      return reply(result);
    } catch (e) {
      return reply(Boom.badRequest(e));
    }
  };
  const permissions = [`${componentId}:${association.as}:findOne`];
  return { handler, permissions };
};

export default function (model, { componentId, associations }) {
  let handler;
  let permissions;

  ({ handler, permissions } = handlerFindAll(model, componentId));
  this.findAll = handler;
  this.findAll.permissions = permissions;

  ({ handler, permissions } = handlerCount(model, componentId));
  this.count = handler;
  this.count.permissions = permissions;

  ({ handler, permissions } = handlerFindOne(model, componentId));
  this.findOne = handler;
  this.findOne.permissions = permissions;

  ({ handler, permissions } = handlerFindById(model, componentId));
  this.findById = handler;
  this.findById.permissions = permissions;

  ({ handler, permissions } = handlerCreate(model, componentId));
  this.create = handler;
  this.create.permissions = permissions;

  if (associations) {
    const validAssociations = Joi.validate(associations, [Joi.string().valid('*'), Joi.array().items(Joi.string())]);
    if (!validAssociations || validAssociations.error) {
      throw validAssociations.error;
    }

    let associationsRequested;
    if (validAssociations === '*') {
      associationsRequested = model.associations;
    } else {
      associationsRequested = _.pick(model.associations, associations);
    }

    _.each(associationsRequested, (association) => {
      switch (association.associationType) {
        case 'BelongsToMany':
        case 'HasMany':
          ({ handler, permissions } = handlerAssociationFindAll(model, componentId, association));
          this[`${association.as}FindAll`] = handler;
          this[`${association.as}FindAll`].permissions = permissions;
          break;
        default:
          ({ handler, permissions } = handlerAssociationFindOne(model, componentId, association));
          this[`${association.as}FindOne`] = handler;
          this[`${association.as}FindOne`].permissions = permissions;
          break;
      }
    });
  }
}
