import { Joi } from "celebrate";

export const patient_history_validation = {
  // Query parameters
  query: Joi.object({
    firstname: Joi.string().allow("").optional(),
    lastname: Joi.string().allow("").optional(),
    email: Joi.string().email().allow("").optional(),
    phone_no: Joi.string()
    .trim()
    .pattern(/^\d{11,13}$/)
    .optional(), // Adjust based on your phone number validation requirements
    page: Joi.string()
      .required()
      .pattern(/^\d+$/, "page must be a positive integer"),
    page_size: Joi.string()
      .required()
      .pattern(/^\d+$/, "page_size must be a positive integer"),
  }).required(),

  // Empty body (optional)
  body: Joi.object().allow({}), // Allow an empty object for the body
};

export const patient_records_validation = {
  // Query parameters
  query: Joi.object({
    page: Joi.string()
      .required()
      .pattern(/^\d+$/, "page must be a positive integer"),
    page_size: Joi.string()
      .required()
      .pattern(/^\d+$/, "page_size must be a positive integer"),
  }).required(),

  // Empty body (optional)
  body: Joi.object().allow({}), // Allow an empty object for the body
};

export const patient_records_view_documents_validation = {
  // Path parameters
  params: Joi.object({
    confirmation_no: Joi.string()
      .required()
      .min(1)
      .message("Confirmation number is required and must not be empty"), // Adjust validation based on your confirmation number format
  }).required(),

  // Empty body (optional)
  body: Joi.object().allow({}), // Allow an empty object for the body
};

export const patient_records_view_case_validation = {
  // Path parameters
  params: Joi.object({
    confirmation_no: Joi.string()
      .required()
      .min(1)
      .message("Confirmation number is required and must not be empty"), // Adjust validation based on your confirmation number format
  }).required(),

  // Empty body (optional)
  body: Joi.object().allow({}), // Allow an empty object for the body
};

export const search_records_validation = {
  // Query parameters
  query: Joi.object({
    request_status: Joi.string().allow(""),
    patient_name: Joi.string().allow(""),
    request_type: Joi.string().allow(""),
    from_date_of_service: Joi.any().allow(""),
    to_date_of_service: Joi.any().allow(""),
    provider_name: Joi.string().allow(""),
    email: Joi.string().email().allow(""),
    phone_no: Joi.string()
    .trim()
    .pattern(/^\d{11,13}$/)
    .optional(),
    page: Joi.string()
      .required()
      .pattern(/^\d+$/, "page must be a positive integer"),
    page_size: Joi.string()
      .required()
      .pattern(/^\d+$/, "page_size must be a positive integer"),
  }).required(),

  // Empty body (optional)
  body: Joi.object().allow({}), // Allow an empty object for the body
};

export const search_record_delete_validation = {
  // Path parameters
  params: Joi.object({
    confirmation_no: Joi.string()
      .required()
      .min(1)
      .message("Confirmation number is required and must not be empty"),
  }).required(),
};

export const logs_history_validation = {
  // Query parameters
  query: Joi.object({
    type_of_log: Joi.string().allow(""),
    search_by_role: Joi.string().allow(""),
    receiver_name: Joi.string().allow(""),
    email_id: Joi.string().email().allow(""),
    mobile_no: Joi.string()
    .trim()
    .pattern(/^\d{11,13}$/)
    .optional(),
    created_date: Joi.any().allow(""),
    sent_date: Joi.any().allow(""),
    page: Joi.string()
      .required()
      .pattern(/^\d+$/, "page must be a positive integer"),
    page_size: Joi.string()
      .required()
      .pattern(/^\d+$/, "page_size must be a positive integer"),
  }).required(),

  // Empty body (optional)
  body: Joi.object().allow({}),
};

export const cancel_and_block_history_validation = {
  // Query parameters
  query: Joi.object({
    type_of_history: Joi.string().required().valid("cancelled", "blocked"),
    name: Joi.string().allow(""),
    date: Joi.any().allow(""),
    email: Joi.string().email().allow(""),
    phone_no:Joi.string()
    .trim()
    .pattern(/^\d{11,13}$/)
    .optional(),
    page: Joi.string()
      .required()
      .pattern(/^\d+$/, "page must be a positive integer"),
    page_size: Joi.string()
      .required()
      .pattern(/^\d+$/, "page_size must be a positive integer"),
  }).required(),

  // Empty body (optional)
  body: Joi.object().allow({}), // Allow an empty object for the body
};

export const block_history_unblock_validation = {
  // Path parameters
  params: Joi.object({
    confirmation_no: Joi.string()
      .required()
      .min(1)
      .message("Confirmation number is required and must not be empty"),
  }).required(),
};
