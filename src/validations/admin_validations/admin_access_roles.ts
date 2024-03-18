import { Joi } from "celebrate";

export const manage_account_access_validation_schema = {
  query: Joi.object().when('action', {
    is: 'list',
    then: Joi.object({
      page: Joi.string().optional().allow(''), // Allow empty string for optional pagination
      pageSize: Joi.string().optional().allow(''),
    }),
  }),
  params: Joi.object().when('action', {
    is: 'view',
    then: Joi.object({
      user_id: Joi.string().required().alphanum(), // Assuming user_id is alphanumeric
    }),
  }),
};

export const manage_user_access_validation_Schema = {
  query: Joi.object().when('action', {
    is: 'list',
    then: Joi.object({
      role: Joi.string().optional().allow(''), // Allow empty string for optional role filter
    }),
  }),
  params: Joi.object().when('action', {
    is: 'edit',
    then: Joi.object({
      user_id: Joi.string().required().alphanum(), // Assuming user_id is alphanumeric
    }),
  }),
};
