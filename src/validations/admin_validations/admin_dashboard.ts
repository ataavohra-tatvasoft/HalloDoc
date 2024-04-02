import { Joi } from "celebrate";

//Admin Create Request
export const admin_create_request_validation = {
  body: Joi.object({
    firstname: Joi.string().trim().required(),
    lastname: Joi.string().trim().required(),
    phone_number: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
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
      .valid("district_of_columbia", "new_york", "virginia", "maryland"),
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

/**Admin Request Actions */
//view case
export const view_case_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};

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
};
export const view_uploads_download_all_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
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

//Send and Update Agreement
export const send_agreement_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object({
    mobile_no: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
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
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
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
    mobile_no: Joi.string().optional().allow(""),
    email: Joi.string().email().optional().allow(""),
  }),
};
