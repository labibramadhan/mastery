import path from 'path';
import Joi from 'joi';

const prefix = conf.get('prefix');

const RouteGeneratorFindAll = requireF('services/_core/routeGenerators/RouteGeneratorFindAll');
const RouteGeneratorFindOne = requireF('services/_core/routeGenerators/RouteGeneratorFindOne');
const RouteGeneratorFindById = requireF('services/_core/routeGenerators/RouteGeneratorFindById');
const RouteGeneratorCount = requireF('services/_core/routeGenerators/RouteGeneratorCount');
const RouteGeneratorCreate = requireF('services/_core/routeGenerators/RouteGeneratorCreate');
const RouteGeneratorUpdate = requireF('services/_core/routeGenerators/RouteGeneratorUpdate');

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

  const routeGeneratorFindAll = new RouteGeneratorFindAll(models.user);
  const routeGeneratorFindOne = new RouteGeneratorFindOne(models.user);
  const routeGeneratorFindById = new RouteGeneratorFindById(models.user);
  const routeGeneratorCount = new RouteGeneratorCount(models.user);
  const routeGeneratorCreate = new RouteGeneratorCreate(models.user);
  const routeGeneratorUpdate = new RouteGeneratorUpdate(models.user);

  return [
    routeGeneratorFindAll.generate(),
    routeGeneratorFindOne.generate(),
    routeGeneratorFindById.generate(),
    routeGeneratorCount.generate(),
    routeGeneratorCreate.generate(),
    routeGeneratorUpdate.generate(),
    {
      // define /user/login route
      method: 'POST',
      path: path.join(prefix, 'user', 'login'),
      handler: handlerLogin.handler,
    }, {
      // define GET /user/{id}/roles route
      method: 'GET',
      path: path.join(prefix, 'user', '{id}', 'roles'),
      handler: handlerAssociations.rolesFindAll.handler,
      config: {
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
