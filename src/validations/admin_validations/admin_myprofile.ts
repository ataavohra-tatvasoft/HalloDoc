import { Joi } from "celebrate";

export const admin_profile_reset_password_validation_schema = {
  body: Joi.object({
    password: Joi.string().required(),
    user_id: Joi.number().integer().positive().required(),
  }),
};

export const admin_profile_edit_validation_schema = {
  body: Joi.object({
    user_id: Joi.number().integer().positive().required(),
    firstname: Joi.string(),
    lastname: Joi.string(),
    email: Joi.string().email(),
    mobile_no: Joi.string(),
    address_1: Joi.string(),
    address_2: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zip: Joi.string(),
    billing_mobile_no: Joi.string(),
  }),
};

export const admin_profile_admin_info_edit_validation = {
  body: Joi.object({
    firstname: Joi.string().trim().required(),
    lastname: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    confirm_email: Joi.ref("email"),
    mobile_no: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    district_of_columbia: Joi.boolean().optional(),
    new_york: Joi.boolean().optional(),
    virginia: Joi.boolean().optional(),
    maryland: Joi.boolean().optional(),
    user_id: Joi.number().required(),
  }).required(),
};

export const admin_profile_mailing_billling_info_edit_validation = {
  body: Joi.object({
    user_id: Joi.number().required(),
    address_1: Joi.string().trim().required(),
    address_2: Joi.string().trim().allow(""), // Optional field
    city: Joi.string().trim().required(),
    state: Joi.string().length(2).uppercase().required(),
    zip: Joi.string()
      .length(5)
      .pattern(/^[0-9]+$/)
      .required(),
    billing_mobile_no: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .allow(""), // Optional field
  }).required(),
};
