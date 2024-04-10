import { Joi } from "celebrate";

//Admin Create Request
export const admin_create_request_validation = {
  body: Joi.object({
    firstname: Joi.string().trim().required(),
    lastname: Joi.string().trim().required(),
    phone_number: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .required(),
    email: Joi.string().email().required(),
    DOB: Joi.date().iso().required(),
    street: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string()
      .trim()
      .required()
      .valid("District Of Columbia", "New York", "Virginia", "Maryland"),
    zip: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required(),
    room: Joi.string().trim().optional().allow(""), // Optional room number
    admin_notes: Joi.string().trim().optional().allow(""), // Optional admin notes
  }).required(),
};

export const admin_create_request_verify_validation = {
  body: Joi.object({
    state: Joi.string()
      .trim()
      .required()
      .valid("District Of Columbia", "New York", "Virginia", "Maryland"),
  }).required(),
};

//Request by state and counts
export const manage_requests_by_state_validation = {
  query: Joi.object({
    state: Joi.string()
      .valid("new", "pending", "active", "conclude", "toclose", "unpaid")
      .required(),
    firstname: Joi.string(),
    lastname: Joi.string(),
    region: Joi.string(),
    requestor: Joi.string(),
    page: Joi.number().integer().min(1),
    page_size: Joi.number().integer().min(1),
  }),
};
export const requests_by_request_state_refactored_validation = {
  query: Joi.object({
    state: Joi.string()
      .trim()
      .valid("new", "pending", "active", "conclude", "toclose", "unpaid")
      .required(),
    search: Joi.string().trim().optional().allow(""), // Allow empty string for search
    region: Joi.string().trim().optional().allow(""), // Allow empty string for region
    requestor: Joi.string().trim().optional().allow(""), // Allow empty string for requestor
    page: Joi.number().integer().positive().optional(),
    page_size: Joi.number().integer().positive().optional(),
  }),
};
/**Admin Request Actions */

//View and Save Notes
export const view_notes_for_request_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};
export const save_view_notes_for_request_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(), // Assuming confirmation_no is alphanumeric
  }),
  body: Joi.object({
    new_note: Joi.string().required().min(1), // Minimum length of 1 character
  }),
};

//View and Cancel Case
export const cancel_case_for_request_view_data_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};
export const cancel_case_for_request_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object({
    reason: Joi.string().required().min(3).max(255), // Reason with minimum and maximum length
    additional_notes: Joi.string().optional().allow(""), // Optional notes allowing empty string
  }),
};

//Assign Request
export const assign_request_region_physician_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
  query: Joi.object({
    region: Joi.string().optional().allow(""), // Optional region allowing empty string
  }),
};
export const assign_request_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object({
    firstname: Joi.string().required().min(3).max(255),
    lastname: Joi.string().required().min(3).max(255),
    assign_req_description: Joi.string().optional().allow(""),
  }),
};

//Block Request
export const block_case_for_request_view_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};
export const block_case_for_request_post_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object({
    reason_for_block: Joi.string().required().min(3).max(255), // Reason with minimum and maximum length
  }),
};

//Transfer Request
export const transfer_request_region_physicians_validation = {
  query: Joi.object({
    region: Joi.string().optional(),
  }),
};
export const transfer_request_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

//Clear Case
export const clear_case_for_request_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};

//Close Case
export const close_case_for_request_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};
export const close_case_for_request_view_details_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};
export const close_case_for_request_edit_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    dob: Joi.date().required(), // Ensures valid date format
    mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),
    email: Joi.string().email().required(),
  }),
};
export const close_case_for_request_actions_download_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
    document_id: Joi.string().required(),
  }),
};

/**Admin Request Support */
export const request_support_validation = {
  body: Joi.object({
    support_message: Joi.string().required().min(5).max(500),
  }),
};

/**Admin Send Link */
export const admin_send_link_validation = {
  body: Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),
    email: Joi.string().email().optional().allow(""),
  }),
};
