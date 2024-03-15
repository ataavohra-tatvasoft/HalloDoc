import { Joi } from 'celebrate';

export const manage_account_access_validation_schema = {
  query: Joi.object().keys({
    action: Joi.string().valid('list', 'edit', 'save', 'delete').required(),
    page: Joi.string().optional(),
    pageSize: Joi.string().optional(),
  }),
  params: Joi.object().keys({
    user_id: Joi.string().uuid().when('action', {
      is: 'edit',
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
  }),
  body: Joi.object().keys({
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    mobile_no: Joi.string().optional(),
    address_1: Joi.string().optional(),
    address_2: Joi.string().optional(),
    city: Joi.string().optional(),
    region: Joi.string().optional(),
    zip: Joi.string().optional(),
    dob: Joi.date().optional(),
  }).when('action', {
    is: Joi.string().valid('save'),
    then: Joi.object().min(1).required(),
    otherwise: Joi.object().forbidden()
  })
};

export const manage_user_access_validation_Schema = {
  query: Joi.object().keys({
    action: Joi.string().valid('list', 'edit', 'save').required(),
    role: Joi.string().allow('').optional(), // Optional parameter for 'list' action
  }),
  params: Joi.object().keys({
    user_id: Joi.number().integer().required().min(1), // Required for 'edit' and 'save' actions
  }),
  body: Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    mobile_no: Joi.string().required(),
    address_1: Joi.string().required(),
    address_2: Joi.string().optional().allow(''),
    city: Joi.string().required(),
    region: Joi.string().required(),
    zip: Joi.string().required(),
    dob: Joi.date().required(),
  }).when(Joi.ref('action'), {
    is: 'save',
    then: Joi.object({
      // Required for 'save' action
      user_id: Joi.number().integer().required().min(1), // Ensure user_id is present for 'save' action
    }),
  }),
};
