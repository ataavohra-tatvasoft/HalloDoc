import { Joi } from "celebrate";
import { query } from "express";

export const partner_vendor_list_validation = {
  query: Joi.object({
    firstname: Joi.string().allow("", null).optional(),
    lastname: Joi.string().allow("", null).optional(),
    profession: Joi.string().allow("", null).optional(),
    page: Joi.number().integer().min(1).optional(),
    page_size: Joi.number().integer().min(1).optional(),
  }),
};

export const add_business_validation = {
  body: Joi.object({
    business_name: Joi.string().required(),
    profession: Joi.string().required(),
    fax_number: Joi.number().allow(null).optional(),
    mobile_no: Joi.string()
    .trim()
    .pattern(/^\d{11,13}$/)
    .required(),
    email: Joi.string().email().required(),
    business_contact: Joi.number().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.number().required(),
  }),
};

export const update_business_view_validation = {
  params: Joi.object({
   business_id: Joi.number().required()
  }),
};

export const update_business_validation = {
  body: Joi.object({
    business_name: Joi.string().required(),
    profession: Joi.string().required(),
    fax_number: Joi.number().allow(null).optional(),
    mobile_no: Joi.string()
    .trim()
    .pattern(/^\d{11,13}$/)
    .optional(),
    email: Joi.string().email().required(),
    business_contact: Joi.number().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.number().required(),
  }),
};

export const delete_vendor_validation = {
  params: Joi.object({
    business_id: Joi.number().required(),
  }),
};
