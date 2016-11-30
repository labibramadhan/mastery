import Joi from 'joi';

export default class RequestValidatorConstants {
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
    findById: [],
    create: [
      'payload',
    ],
    update: [],
    findAllOneToMany: [
      'where',
      'include',
      'order',
      'limit',
      'offset',
    ],
    countOneToMany: [
      'where',
    ],
    findOneOneToOne: [],
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
}
