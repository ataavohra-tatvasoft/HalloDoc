import { Joi } from "celebrate";
import { emit } from "process";

export const admin_profile_reset_password_validation_schema = {
  body: Joi.object({
    password: Joi.string().required(),
    user_id: Joi.number().integer().positive().required(),
  }),
};

export const admin_profile_edit_validation = {
  body: Joi.object({
    user_id: Joi.number().integer().positive().required(),
    firstname: Joi.string().trim().min(2).max(50).optional(),
    lastname: Joi.string().trim().min(2).max(50).optional(),
    email: Joi.string().email().lowercase().optional(),
    confirm_email: Joi.ref("email"),
    mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{10}$/)
      .optional(),

    // Optional address fields
    address_1: Joi.string().trim().allow(null, "").optional(),
    address_2: Joi.string().trim().allow(null, "").optional(),
    city: Joi.string().trim().allow(null, "").optional(),
    state: Joi.string().trim().allow(null, "").optional(),
    zip: Joi.string().trim().length(6).allow(null, "").optional(),

    billing_mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{10}$/)
      .allow(null, "")
      .optional(),

    district_of_columbia: Joi.boolean().allow(null).optional(),
    new_york: Joi.boolean().allow(null).optional(),
    virginia: Joi.boolean().allow(null).optional(),
    maryland: Joi.boolean().allow(null).optional(),
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
