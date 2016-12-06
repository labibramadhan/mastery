import Joi from 'joi';

export default class ValidatorConstants {
  static APPLICABLE_METHODS = {
    findAll: [
      'where',
      'include',
      'order',
      'limit',
      'offset',
    ],
    count: [
      'where',
    ],
    findOne: [
      'where',
      'include',
      'order',
      'offset',
    ],
    findById: [
      'pk',
    ],
    create: [
      'payload',
    ],
    update: [
      'pk',
    ],
    delete: [
      'pk',
    ],
    associationFindAll: [
      'where',
      'include',
      'order',
      'limit',
      'offset',
    ],
    associationCount: [
      'where',
    ],
    associationFindOne: [],
    associationCreate: [
      'payload',
    ],
    associationAdd: [
      'pk2',
    ],
    associationAddMultiple: [],
    associationRemove: [
      'pk2',
    ],
    associationRemoveMultiple: [],
  };

  static SEQUELIZE_OPERATORS = {
    $and: Joi.any(),
    $or: Joi.any(),
    $gt: Joi.any(),
    $gte: Joi.any(),
    $lt: Joi.any(),
    $lte: Joi.any(),
    $ne: Joi.any(),
    $eq: Joi.any(),
    $not: Joi.any(),
    $between: Joi.any(),
    $notBetween: Joi.any(),
    $in: Joi.any(),
    $notIn: Joi.any(),
    $like: Joi.any(),
    $notLike: Joi.any(),
    $iLike: Joi.any(),
    $notILike: Joi.any(),
    $overlap: Joi.any(),
    $contains: Joi.any(),
    $contained: Joi.any(),
    $any: Joi.any(),
    $col: Joi.any(),
  }

  static VALIDATABLE_REQUEST = ['query', 'params', 'payload'];
}