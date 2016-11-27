import _ from 'lodash';
import Joi from 'joi';

const HandlerGeneratorAssociationFindAll = requireF('services/_core/HandlerGeneratorAssociationFindAll');
const HandlerGeneratorAssociationCount = requireF('services/_core/HandlerGeneratorAssociationCount');
const HandlerGeneratorAssociationFindOne = requireF('services/_core/HandlerGeneratorAssociationFindOne');

export default class HandlerGeneratorAssociations {
  constructor(model, componentId, associations) {
    this.model = model;
    this.componentId = componentId;
    this.associations = associations;
  }

  generate = function generate() {
    const self = this;
    const {
      associations,
      componentId,
      model,
    } = self;
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
        case 'HasMany': {
          const handlerAssociationFindAll = new HandlerGeneratorAssociationFindAll(
            model,
            componentId,
            association,
          );
          self[`${association.as}FindAll`] = {
            handler: handlerAssociationFindAll.handler,
            permissions: handlerAssociationFindAll.permissions,
          };

          const handlerAssociationCount = new HandlerGeneratorAssociationCount(
            model,
            componentId,
            association,
          );
          self[`${association.as}Count`] = {
            handler: handlerAssociationCount.handler,
            permissions: handlerAssociationCount.permissions,
          };
          break;
        }
        default: {
          const handlerAssociationFindOne = new HandlerGeneratorAssociationFindOne(
            model,
            componentId,
            association,
          );
          self[`${association.as}FindOne`] = {
            handler: handlerAssociationFindOne.handler,
            permissions: handlerAssociationFindOne.permissions,
          };
          break;
        }
      }
    });
  }

}
