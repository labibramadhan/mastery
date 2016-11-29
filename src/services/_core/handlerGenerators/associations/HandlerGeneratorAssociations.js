import _ from 'lodash';
import Joi from 'joi';

const HandlerGeneratorAssociationFindAll = requireF('services/_core/handlerGenerators/associations/HandlerGeneratorAssociationFindAll');
const HandlerGeneratorAssociationCount = requireF('services/_core/handlerGenerators/associations/HandlerGeneratorAssociationCount');
const HandlerGeneratorAssociationFindOne = requireF('services/_core/handlerGenerators/associations/HandlerGeneratorAssociationFindOne');

/**
 * Class to generate handlers of all selected associations
 *
 * @export
 * @class HandlerGeneratorAssociations
 */
export default class HandlerGeneratorAssociations {
  /**
   * Creates an instance of HandlerGeneratorAssociations.
   *
   * @param {Sequelize.Model} model
   * @param {array|string} associations
   *
   * @memberOf HandlerGeneratorAssociations
   */
  constructor(model, associations) {
    this.model = model;
    this.associations = associations;
  }

  /**
   * Take a look at component/_core/user/userRoutes.js for how this works
   *
   * @memberOf HandlerGeneratorAssociations
   */
  generate = function generate() {
    const self = this;
    const validAssociations = Joi.validate(this.associations, [Joi.string().valid('*'), Joi.array().items(Joi.string())]);
    if (!validAssociations || validAssociations.error) {
      throw validAssociations.error;
    }

    let associationsRequested;
    if (validAssociations === '*') {
      associationsRequested = this.model.associations;
    } else {
      associationsRequested = _.pick(this.model.associations, this.associations);
    }

    _.each(associationsRequested, (association) => {
      switch (association.associationType) {
        case 'BelongsToMany':
        case 'HasMany': {
          const handlerAssociationFindAll = new HandlerGeneratorAssociationFindAll(
            this.model,
            association,
          );
          self[`${association.as}FindAll`] = {
            handler: handlerAssociationFindAll.handler,
            permissions: handlerAssociationFindAll.permissions,
          };

          const handlerAssociationCount = new HandlerGeneratorAssociationCount(
            this.model,
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
            this.model,
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
