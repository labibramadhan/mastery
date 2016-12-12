import Path from 'path';
import _ from 'lodash';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const FindAssociationHandler = requireF('core/services/generators/handler/associations/FindAssociationHandler');
const FindAllAssociationHandler = requireF('core/services/generators/handler/associations/FindAllAssociationHandler');

export default class FindAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationFind';

    const classes = {
      target: FindAssociationHandler,
    };
    if (association.associationType === 'BelongsToMany' || association.associationType === 'HasMany') {
      classes.target = FindAllAssociationHandler;
    }

    // eslint-disable-next-line dot-notation,new-cap
    const handlerGenerator = new classes['target'](model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    this.method = 'GET';
    this.path = Path.join(model.name, '{pk}', association.as);

    if (association.associationType === 'BelongsToMany' || association.associationType === 'HasMany') {
      this.requestValidators = [`${model.name}.findById`, `${association.target.name}.${methodName}All`];
      this.parsers = ['findById', `${methodName}All`];
      _.set(this.identifier, 'preHandlerValidators', [`${model.name}.findById`, `${model.name}.${association.as}.${methodName}All`]);
    }
  }
}
