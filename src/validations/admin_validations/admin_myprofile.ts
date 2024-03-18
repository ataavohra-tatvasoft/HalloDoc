import { Joi } from "celebrate";

export const admin_profile_reset_password_validation_schema = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    admin_id: Joi.number().integer().positive().required(),
  }),
};

export const admin_profile_edit_validation_schema = {
  body: Joi.object().keys({
    admin_id: Joi.number().integer().positive().required(),
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
