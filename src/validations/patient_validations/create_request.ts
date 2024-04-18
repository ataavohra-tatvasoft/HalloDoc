import { Joi } from "celebrate";

export const is_patient_registered_validation = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const create_request_by_patient_validation = {
  body: Joi.object({
    symptoms: Joi.string().allow(""),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    date_of_birth: Joi.string().optional(),
    email: Joi.string().email().required(),
    mobile_no: Joi.string().allow(""),
    street: Joi.string().allow(""),
    city: Joi.string().allow(""),
    state: Joi.string().alphanum().optional(),
    zip: Joi.string().allow(""),
    room: Joi.string().allow(""),
    password: Joi.string().min(6).optional(),
  }),
  // file: Joi.object({
  //   fieldname: Joi.string().optional(),
  // }).optional(),
};

export const create_request_by_family_friend_validation = {
  body: Joi.object({
    your_first_name: Joi.string().required(),
    your_last_name: Joi.string().required(),
    your_mobile_no: Joi.string().allow(""),
    your_email: Joi.string().email().optional(),
    your_relation_with_patient: Joi.string().optional(),
    symptoms: Joi.string().allow(""),
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    date_of_birth: Joi.string().optional(),
    email: Joi.string().email().optional(),
    mobile_no: Joi.string().allow(""),
    street: Joi.string().allow(""),
    city: Joi.string().allow(""),
    state: Joi.string().alphanum().optional(),
    zip: Joi.string().allow(""),
    room: Joi.string().allow(""),
  }),
  // file: Joi.object({
  //   fieldname: Joi.string().optional(),
  // }).optional(),
};
