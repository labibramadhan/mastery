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
      this.requestValidators = [
        ..._.remove(this.requestValidators, val => val !== `${association.target.name}.${methodName}`),
        `${association.target.name}.${methodName}All`,
      ];
      this.parsers = [
        ..._.remove(this.parsers, val => val !== methodName),
        `${methodName}All`,
      ];
    }
  }
}
