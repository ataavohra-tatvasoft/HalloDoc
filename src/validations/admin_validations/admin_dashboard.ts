import { Joi } from "celebrate";

//Request by state and counts
export const manage_requests_by_state_validation = {
  query: Joi.object().keys({
    state: Joi.string()
      .valid("new", "pending", "active", "conclude", "toclose", "unpaid")
      .required(),
    firstname: Joi.string(),
    lastname: Joi.string(),
    region: Joi.string(),
    requestor: Joi.string(),
    page: Joi.number().integer().min(1),
    pageSize: Joi.number().integer().min(1),
  }),
};

/**Admin Request Actions */
//view case
export const view_case_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
};

//View and Save Notes
export const view_notes_for_request_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
};
export const save_view_notes_for_request_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object().keys({
    new_note: Joi.string()
      .when("method", {
        is: "POST",
        then: Joi.required(), // Required only for POST requests
        otherwise: Joi.optional(), // Optional for other methods (e.g., PUT, PATCH)
      })
      .allow("") // Allow empty string for optional scenarios
      .trim(), // Remove leading/trailing whitespace
  }),
};

//View and Cancel Case
export const cancel_case_for_request_view_data_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
};
export const cancel_case_for_request_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object().keys({
    reason: Joi.string().required().min(3).max(255), // Reason with minimum and maximum length
    additional_notes: Joi.string().optional().allow(""), // Optional notes allowing empty string
  }),
};

//Assign Request
export const assign_request_region_physician_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
  query: Joi.object().keys({
    region: Joi.string().optional().allow(""), // Optional region allowing empty string
  }),
};
export const assign_request_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object().keys({
    firstname: Joi.string().required().min(3).max(255),
    lastname: Joi.string().required().min(3).max(255),
    assign_req_description: Joi.string().optional().allow(""),
  }),
};

//Block Request
export const block_case_for_request_view_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
};
export const block_case_for_request_post_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object().keys({
    reason_for_block: Joi.string().required().min(3).max(255), // Reason with minimum and maximum length
  }),
};

//View Uploads
export const view_uploads_view_data_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
};
export const view_uploads_upload_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
};
export const view_uploads_actions_delete_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
    document_id: Joi.number().required(), // Enforce document_id to be a number
  }),
};
export const view_uploads_actions_download_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
    document_id: Joi.number().required(),
  }),
};
export const view_uploads_delete_all_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
};
export const view_uploads_download_all_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
};

//Send Orders
export const business_name_for_send_orders_validation = {
  query: Joi.object().keys({
    profession: Joi.string().optional(),
  }),
};
export const view_send_orders_for_request_validation = {
  query: Joi.object().keys({
    profession: Joi.string().required(),
    business: Joi.string().required(),
  }),
};
export const send_orders_for_request_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
    state: Joi.string().valid("active", "conclude", "toclose").required(),
  }),
  query: Joi.object().keys({
    business_contact: Joi.string().optional(),
    email: Joi.string().email().optional().when("business_contact", {
      is: Joi.string().required(),
      then: Joi.required(),
    }),
  }),
  body: Joi.object().keys({
    order_details: Joi.object().required(),
    number_of_refill: Joi.number().required(),
  }),
};

//Transfer Request
export const transfer_request_region_physicians_validation = {
  query: Joi.object().keys({
    region: Joi.string().optional(),
  }),
};
export const transfer_request_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

//Clear Case
export const clear_case_for_request_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
};

//Send and Update Agreement
export const send_agreement_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object().keys({
    mobile_no: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    email: Joi.string().email().required(),
  }),
};
export const update_agreement_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object().keys({
    agreement_status: Joi.string().valid("accepted", "rejected").required(),
  }),
};

//Close Case
export const close_case_for_request_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
};
export const close_case_for_request_view_details_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
};
export const close_case_for_request_edit_validation = {
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object().keys({
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
  params: Joi.object().keys({
    confirmation_no: Joi.string().required(),
    document_id: Joi.string().required(),
  }),
};

/**Admin Request Support */
export const request_support_validation = {
  body: Joi.object().keys({
    support_message: Joi.string().required().min(5).max(500),
  }),
};

/**Admin Send Link */

export const admin_send_link_validation = {
  body: Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    mobile_no: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .when("email", {
        is: Joi.string().email().required(),
        then: Joi.optional(),
      }),
    email: Joi.string()
      .email()
      .when("mobile_no", {
        is: Joi.string()
          .length(10)
          .pattern(/^[0-9]+$/)
          .required(),
        then: Joi.optional(),
      }),
  }),
};
