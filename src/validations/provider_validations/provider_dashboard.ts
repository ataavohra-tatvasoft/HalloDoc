import { Joi } from "celebrate";

export const requests_by_request_state_provider_validation = {
  query: Joi.object({
    state: Joi.string().valid("new", "pending", "conclude", "active"),
    search: Joi.string().optional().allow(""),
    requestor: Joi.string().optional().allow(""),
    page: Joi.number().integer().min(1).default(1).optional(),
    page_size: Joi.number().integer().min(1).default(10).optional(),
  }),
};

export const provider_accept_request_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required().min(1), // You can adjust minimum length based on your confirmation number format
  }),
};

export const transfer_request_provider_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required().min(1),
  }),

  body: Joi.object({
    description: Joi.string().required().min(1),
  }),
};

export const view_notes_for_request_provider_validation = {
  params: Joi.object({
    confirmation_no: Joi.string()
      .required()
      .min(1)
      .message(
        "Confirmation number is required and must be at least 1 character long"
      ),
  }),
};

export const save_view_notes_for_request_provider_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object({
    new_note: Joi.string().required(),
  }),
};

export const active_state_encounter_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
  query: Joi.object({
    type_of_care: Joi.string().required(),
  }),
};

export const housecall_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};

export const conclude_state_conclude_care_view_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};

export const conclude_state_conclude_care_upload_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};

export const conclude_state_conclude_care_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};

export const conclude_state_get_encounter_form_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
};

export const conclude_state_encounter_form_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    location: Joi.string().allow(""), // Optional field, can be empty string
    date_of_birth: Joi.date().required(),
    date_of_service: Joi.date().required(),
    phone_no: Joi.string().allow("").optional(), // Optional field, can be empty string
    email: Joi.string().email().allow(""), // Optional field, can be empty string but must be a valid email if provided
    history_of_present: Joi.string().allow(""), // Optional field, can be empty string
    medical_history: Joi.string().allow(""), // Optional field, can be empty string
    medications: Joi.string().allow(""), // Optional field, can be empty string
    allergies: Joi.string().allow(""), // Optional field, can be empty string
    temperature: Joi.number().allow(""), // Optional field, can be empty string or a number
    heart_rate: Joi.number().allow(""), // Optional field, can be empty string or a number
    respiratory_rate: Joi.number().allow(""), // Optional field, can be empty string or a number
    blood_pressure: Joi.number().allow(""), // Optional field, can be empty string
    o2: Joi.number().allow(""), // Optional field, can be empty string or a number
    pain: Joi.string().allow(""), // Optional field, can be empty string
    heent: Joi.string().allow(""), // Optional field, can be empty string
    cv: Joi.string().allow(""), // Optional field, can be empty string
    chest: Joi.string().allow(""), // Optional field, can be empty string
    abd: Joi.string().allow(""), // Optional field, can be empty string
    extr: Joi.string().allow(""), // Optional field, can be empty string
    skin: Joi.string().allow(""), // Optional field, can be empty string
    neuro: Joi.string().allow(""), // Optional field, can be empty string
    other: Joi.string().allow(""), // Optional field, can be empty string
    diagnosis: Joi.string().required(),
    treatment_plan: Joi.string().allow(""), // Optional field, can be empty string
    medication_dispensed: Joi.string().allow(""), // Optional field, can be empty string
    procedures: Joi.string().allow(""), // Optional field, can be empty string
    follow_up: Joi.string().allow(""), // Optional field, can be empty string
  }),
};

export const conclude_state_encounter_form_finalize_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required(),
  }),
  body: Joi.object({
    finalize_status: Joi.string().valid(true, false).required(),
  }),
};
