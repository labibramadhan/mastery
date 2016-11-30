import path from 'path';
import Joi from 'joi';

const prefix = conf.get('prefix');

const HandlerGeneratorAssociations = requireF('services/_core/handlerGenerators/associations/HandlerGeneratorAssociations');
const UserHandlerLogin = requireF('component/_core/user/UserHandlerLogin');

const RequestValidators = requireF('services/_core/requestValidators/RequestValidators');

const authStrategiesConfig = requireF('setup/config/authStrategiesConfig');

export default (models) => {
  // define user component endpoint

  const requestValidators = new RequestValidators(models.user);
  requestValidators.build();

  const handlerLogin = new UserHandlerLogin();
  const handlerAssociations = new HandlerGeneratorAssociations(models.user, ['roles']);
  handlerAssociations.generate();

  return [
    {
      // define /user/login route
      method: 'POST',
      path: path.join(prefix, 'user', 'login'),
      handler: handlerLogin.handler,
      config: {
        tags: ['api'],
        validate: {
          payload: {
            username: Joi.string(),
            email: Joi.string(),
            password: Joi.string().required(),
          },
        },
      },
    }, {
      // define GET /user/{id}/roles route
      method: 'GET',
      path: path.join(prefix, 'user', '{id}', 'roles'),
      handler: handlerAssociations.rolesFindAll.handler,
      config: {
        tags: ['api'],
        auth: {
          strategies: Object.keys(authStrategiesConfig),
          scope: handlerAssociations.rolesFindAll.permissions,
        },
        validate: {
          query: Joi.any(),
        },
      },
    }, {
      // define GET /user/{id}/roles/count route
      method: 'GET',
      path: path.join(prefix, 'user', '{id}', 'roles', 'count'),
      handler: handlerAssociations.rolesCount.handler,
      config: {
        tags: ['api'],
        auth: {
          strategies: Object.keys(authStrategiesConfig),
          scope: handlerAssociations.rolesCount.permissions,
        },
        validate: {
          query: Joi.any(),
        },
      },
    },
  ];
};
