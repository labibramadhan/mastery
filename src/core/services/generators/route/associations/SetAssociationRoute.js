import Path from 'path';
import _ from 'lodash';

const BaseAssociationRoute = requireF('core/services/generators/route/base/BaseAssociationRoute');
const SetAssociationHandler = requireF('core/services/generators/handler/associations/SetAssociationHandler');
const SetAllAssociationHandler = requireF('core/services/generators/handler/associations/SetAllAssociationHandler');

export default class SetAssociationRoute extends BaseAssociationRoute {
  constructor(model, association) {
    const methodName = 'associationSet';

    const classes = {
      target: SetAssociationHandler,
    };
    if (association.associationType === 'BelongsToMany' || association.associationType === 'HasMany') {
      classes.target = SetAllAssociationHandler;
    }

    // eslint-disable-next-line dot-notation,new-cap
    const handlerGenerator = new classes['target'](model, association);

    super({
      association,
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    let pathParts = [model.name, '{pk}', association.as, 'set', '{pk2}'];

    this.method = 'POST';
    if (association.associationType === 'BelongsToMany' || association.associationType === 'HasMany') {
      pathParts = _.remove(pathParts, val => val !== '{pk2}');
      this.requestValidators = [`${model.name}.findById`, `${association.target.name}.${methodName}All`];
      this.parsers = ['findById', `${methodName}All`];
      _.set(this.identifier, 'preHandlerValidators', [`${model.name}.findById`, `${model.name}.${association.as}.${methodName}All`]);
    }

    this.path = Path.join(...pathParts);
  }
}
