import joi from "joi";

export const partner_vendor_list_validation = {
  query: joi.object({
    firstname: joi.string().allow("", null).optional(),
    lastname: joi.string().allow("", null).optional(),
    profession: joi.string().allow("", null).optional(),
    page: joi.number().integer().min(1).optional(),
    page_size: joi.number().integer().min(1).optional(),
  }),
};

export const add_business_validation = {
  body: joi.object({
    business_name: joi.string().required(),
    profession: joi.string().required(),
    fax_number: joi.number().allow(null).optional(),
    mobile_no: joi.number().required(),
    email: joi.string().email().required(),
    business_contact: joi.number().required(),
    street: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zip: joi.number().required(),
  }),
};

export const update_business_validation = {
  body: joi.object({
    business_name: joi.string().required(),
    profession: joi.string().required(),
    fax_number: joi.number().allow(null).optional(),
    mobile_no: joi.number().required(),
    email: joi.string().email().required(),
    business_contact: joi.number().required(),
    street: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zip: joi.number().required(),
  }),
};

export const delete_vendor_validation = {
  params: joi.object({
    business_id: joi.number().required(),
  }),
};
