import path from 'path';

const RouteGeneratorBaseAssociation = requireF('services/_core/routeGenerators/base/RouteGeneratorBaseAssociation');
const HandlerGeneratorAssociationFindOne = requireF('services/_core/handlerGenerators/associations/HandlerGeneratorAssociationFindOne');

export default class RouteGeneratorAssociationFindOne extends RouteGeneratorBaseAssociation {
  constructor(model, association) {
    const methodName = 'findOneOneToOne';
    const methodAlias = 'findOne';
    const inherit = 'findById';
    const handlerGenerator = new HandlerGeneratorAssociationFindOne(model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      inherit,
      methodAlias,
      methodName,
      model,
    });

    const singular = conf.get(`models:${model.name}:singular`) || model.name;

    this.method = 'GET';
    this.path = path.join(singular, '{id}', association.as);
  }
}
