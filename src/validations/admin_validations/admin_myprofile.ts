import { Joi } from 'celebrate';

export const adminProfileResetPasswordValidationSchema = {
  body: Joi.object({
    password: Joi.string().required(),
    admin_id: Joi.number().integer().positive().required(),
  }),
};

export const adminProfileEditValidationSchema = {
  body: Joi.object({
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
