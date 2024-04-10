import { Joi } from "celebrate";

//view case
export const view_case_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};

//View Uploads
export const view_uploads_view_data_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};
export const view_uploads_upload_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};
export const view_uploads_actions_delete_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
    document_id: Joi.number().required(), // Enforce document_id to be a number
  }),
};
export const view_uploads_actions_download_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
    document_id: Joi.number().required(),
  }),
};
export const view_uploads_delete_all_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),

  body: Joi.object({
    document_ids: Joi.array().required(),
  }),
};
export const view_uploads_download_all_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),

  body: Joi.object({
    document_ids: Joi.array().required(),
  }),
};
export const view_uploads_send_mail_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),

  body: Joi.object({
    document_ids: Joi.array().required(),
  }),
};

//Send Orders
export const business_name_for_send_orders_validation = {
  query: Joi.object({
    profession: Joi.string().optional(),
  }),
};
export const view_send_orders_for_request_validation = {
  query: Joi.object({
    profession: Joi.string().required(),
    business: Joi.string().required(),
  }),
};
export const send_orders_for_request_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required().alphanum(),
    state: Joi.string().required().valid("active", "conclude", "toclose"), // Valid states
  }),
  query: Joi.object({
    business_contact: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
  body: Joi.object({
    order_details: Joi.any().required(),
    number_of_refill: Joi.number().integer().min(0).required(), // Non-negative integer
  }),
};

//Send and Update Agreement
export const send_agreement_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object({
    mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),
    email: Joi.string().email().required(),
  }),
};
export const update_agreement_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object({
    agreement_status: Joi.string().valid("accepted", "rejected").required(),
  }),
};
