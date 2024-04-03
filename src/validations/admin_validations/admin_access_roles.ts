import { Joi } from "celebrate";

export const access_accountaccess_validation = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    page_size: Joi.number().integer().min(1).optional(),
  }),
};

export const access_accountaccess_edit_validation = {
  params: Joi.object({
    role_id: Joi.string()
      .required()
      .pattern(/^[0-9]+$/),
  }),
};

export const access_accountaccess_edit_save_validation = {
  params: Joi.object({
    role_id: Joi.number().integer().positive().required(),
  }),
  body: Joi.object().keys({
    role_name: Joi.string().trim().when('role_id', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional().allow(''), // Allow empty string if role_id is absent (for potential partial updates)
    }),
    account_type: Joi.string().trim().when('role_id', {
      is: Joi.exist(),
      then: Joi.required().valid('admin', 'user', 'other'),
      otherwise: Joi.optional().allow(''), // Allow empty string if role_id is absent
    }),
    access_ids: Joi.array().when('role_id', {
      is: Joi.exist(),
      then: Joi.array().items(Joi.number().integer().positive().required()).min(1).unique().optional(),
      otherwise: Joi.optional().allow(null), // Allow null if role_id is absent
    }),
  })
};

export const access_account_access_create_access_validation = {
  body: Joi.object().keys({
    role_name: Joi.string().trim().required().min(3).max(255),
    account_type: Joi.string()
      .trim()
      .required()
      .valid("all", "admin", "physician", "patient"),
    access_ids: Joi.array()
      .items(Joi.number().integer().positive().required())
      .min(1)
      .unique()
      .required(),
  }),
};

export const access_account_access_delete_validation = {
  params: Joi.object({
    role_id: Joi.string()
      .required()
      .pattern(/^[0-9]+$/),
  }),
};

export const access_useraccess_validation = {
  query: Joi.object({
    role: Joi.string().trim().optional().allow(""), // Allow empty string for optional search
  }),
};

export const access_useraccess_edit_validation = {
  params: Joi.object({
    user_id: Joi.string()
      .required()
      .pattern(/^[0-9]+$/),
  }),
};

export const access_useraccess_edit_save_validation = {
  params: Joi.object({
    user_id: Joi.string()
      .required()
      .pattern(/^[0-9]+$/),
  }),
  body: Joi.object({
    firstname: Joi.string().trim().required(),
    lastname: Joi.string().trim().required(),
    mobile_no: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    address_1: Joi.string().trim().required(),
    address_2: Joi.string().trim().optional().allow(""),
    city: Joi.string().trim().required(),
    region: Joi.string().trim().optional().allow(""), // Optional region
    zip: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required(),
    dob: Joi.date().iso().required(),
  }).required(),
};
