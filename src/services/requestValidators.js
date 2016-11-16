import Joi from 'joi';
import _ from 'lodash';

import { concatToJoiObject } from '../services/commonServices';

// define what parameters allowed each method
export const applicableMethods = {
  findAll: [
    'where',
    'include',
    'order',
    'limit',
    'offset',
  ],
  count: [
    'where',
    'include',
    'order',
    'limit',
    'offset',
  ],
  findOne: [
    'where',
    'include',
    'order',
    'offset',
  ],
  findById: [],
  create: [
    'payload'
  ],
};

export const sequelizeOperators = {
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
};

export const buildTokenValidation = () => {
  const JWTRegEx = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+\/=]+$/g;
  return Joi.object().keys({
    token: Joi.string().regex(JWTRegEx)
  });
};

export const buildWhereValidation = (model) => {
  const modelAttributes = Object.keys(model.attributes);
  const validAttributes = modelAttributes.reduce((params, attribute) => {
    // TODO: use joi-sequelize
    params[attribute] = Joi.any();
    return params;
  }, {});
  return Joi.object().keys({
    ...validAttributes,
    ...sequelizeOperators,
  });
};

export const buildIncludeValidation = (models) => {
  let validIncludeString = [];
  let validIncludeModel = [];
  let validIncludeWhere = [];
  let validIncludeAs = [];
  _.each(models, (m) => {
    const associatedModelNames = Object.keys(m.associations);
    const modelHasAssociations = associatedModelNames && associatedModelNames.length;
    const thisValidIncludeString = modelHasAssociations ? Joi.string().valid(...associatedModelNames) : Joi.valid(null);
    validIncludeString = [...validIncludeString, thisValidIncludeString];
    validIncludeModel = [...validIncludeModel, thisValidIncludeString];

    const whereValidation = buildWhereValidation(m);
    validIncludeWhere = [...validIncludeWhere, Joi.alternatives().when('model', {
      is: m.name,
      then: whereValidation
    })];

    const associatedModelAliases = _.map(m.associations, (assoc => assoc.as));
    validIncludeAs = [...validIncludeAs, Joi.alternatives().when('model', {
      is: m.name,
      then: Joi.string().valid(...associatedModelAliases)
    })];
  });

  const validIncludeObject = Joi.object().keys({
    model: validIncludeModel,
    where: validIncludeWhere,
    as: validIncludeAs,
    include: Joi.lazy(() => validInclude),
  });

  const validInclude = {
    include: [
      Joi.array().items(validIncludeString, validIncludeObject),
      validIncludeString,
      validIncludeObject,
    ],
  };
  return validInclude;
};

export const buildPayloadValidation = (model) => {
  const modelAttributes = Object.keys(model.attributes);
  const validAttributes = modelAttributes.reduce((params, attribute) => {
    // TODO: use joi-sequelize
    params[attribute] = Joi.any();
    return params;
  }, {});
  return Joi.object().keys({
    ...validAttributes,
  });
};

const requestValidators = function(models, model) {
  const _self = this;
  _.each(applicableMethods, (methods, sourceMethod) => {
    let matchedValidators = {};

    const hasWhere = applicableMethods[sourceMethod].includes('where');
    const hasInclude = applicableMethods[sourceMethod].includes('include');
    const hasPayload = applicableMethods[sourceMethod].includes('payload');

    if (hasInclude) {
      const includeValidation = concatToJoiObject(
        buildIncludeValidation(models),
        _.get(matchedValidators, 'query')
      );
      matchedValidators = _.set(matchedValidators, 'query', includeValidation);
    }

    if (hasWhere) {
      const whereValidation = concatToJoiObject(
        buildWhereValidation(model),
        _.get(matchedValidators, 'query')
      );
      matchedValidators = _.set(matchedValidators, 'query', whereValidation);
    }

    if (hasPayload) {
      const payloadValidation = concatToJoiObject(
        buildPayloadValidation(model),
        _.get(matchedValidators, 'payload')
      );
      matchedValidators = _.set(matchedValidators, 'payload', payloadValidation);
    }

    const tokenValidation = concatToJoiObject(
      buildTokenValidation(),
      _.get(matchedValidators, 'query')
    );
    matchedValidators = _.set(matchedValidators, 'query', tokenValidation);

    _self[sourceMethod] = matchedValidators;
  });
};

export default requestValidators;