import { Joi } from "celebrate";

export const provider_list_validation = {
  query: Joi.object({
    region: Joi.string().allow(""),
    page: Joi.string()
      .optional()
      .pattern(/^\d+$/, "page must be a positive integer"),
    page_size: Joi.string()
      .optional()
      .pattern(/^\d+$/, "page_size must be a positive integer"),
  }),
};

export const stop_notification_validation = {
  body: Joi.object({
    user_ids: Joi.array().required(),
    stop_notification_status: Joi.string().valid("yes", "no").required(),
  }),
};

export const contact_provider_validation = {
  query: Joi.object({
    email: Joi.string().email().optional(), // Require email if mobile_no is absent
    mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),
  }),

  body: Joi.object({
    message: Joi.string().required().min(1),
  }),
};

export const view_edit_physician_account_validation = {
  params: Joi.object({
    user_id: Joi.string().required(),
  }),
};

export const physician_account_reset_password_validation = {
  body: Joi.object({
    user_id: Joi.number().required(),
    password: Joi.string()
      .required()
      .min(4)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must be at least 6 characters and contain a lowercase, uppercase, number, and special symbol"
      ),
  }),
};

export const save_user_information_validation = {
  body: Joi.object({
    user_id: Joi.number().integer().positive().required(),

    username: Joi.string().alphanum().min(3).max(30).optional(),

    status: Joi.string().allow("active", "in-active").optional(),

    role: Joi.string().optional(),

    firstname: Joi.string().trim().min(2).max(50).optional(),
    lastname: Joi.string().trim().min(2).max(50).optional(),
    email: Joi.string().email().lowercase().optional(),
    mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),

    // Optional medical credentials
    medical_licence: Joi.string().allow(null, ""),
    NPI_no: Joi.string().allow(null, ""),

    // Optional synchronization email
    synchronization_email: Joi.string().email().allow(null, ""),

    // Optional address fields
    address_1: Joi.string().trim().allow(null, ""),
    address_2: Joi.string().trim().allow(null, ""),
    city: Joi.string().trim().allow(null, ""),
    state: Joi.string().trim().allow(null, ""),
    zip: Joi.string().trim().length(6).allow(null, ""),

    // Optional billing phone number
    billing_mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),

    // Business details
    business_name: Joi.string().trim().optional(),
    business_website: Joi.string().uri().allow(null, ""), // Optional website URL

    // Optional admin notes
    admin_notes: Joi.string().allow(null, ""),

    // Region selections
    district_of_columbia: Joi.boolean().allow(null),

    new_york: Joi.boolean().allow(null),

    virginia: Joi.boolean().allow(null),

    maryland: Joi.boolean().allow(null),
  }),
};

export const delete_provider_account_validation = {
  params: Joi.object({
    user_id: Joi.string().required(),
  }),
};

export const provider_profile_upload_validation = {
  params: Joi.object({
    user_id: Joi.string().required(),
  }),
  files: Joi.array().items(
    Joi.object({
      fieldname: Joi.string()
        .valid("profile_picture", "signature_photo")
        .required(),
    })
  ),
};

export const provider_onboarding_upload_validation = {
  body: Joi.object({
    user_id: Joi.number().required(),
  }),
  files: Joi.array().items(
    Joi.object({
      fieldname: Joi.string()
        .valid(
          "independent_contractor_agreement",
          "background_check",
          "HIPAA",
          "non_diclosure",
          "licence_document"
        )
        .required(),
    })
  ),
};

export const provider_onboarding_delete_validation = {
  params: Joi.object({
    document_id: Joi.string().required(),
  }),
};

export const create_provider_account_validation = {
  body: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().optional(),
    firstname: Joi.string().trim().required(),
    lastname: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),
    medical_licence: Joi.string().allow(""), // Optional field
    NPI_no: Joi.string().allow(""), // Optional field
    district_of_columbia: Joi.string().allow(""),
    new_york: Joi.string().allow(""),
    virginia: Joi.string().allow(""),
    maryland: Joi.string().allow(""),
    address_1: Joi.string().trim().required(),
    address_2: Joi.string().trim().allow(""), // Optional field
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    zip: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required(),
    billing_mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),
    business_name: Joi.string().trim().allow(""), // Optional field
    business_website: Joi.string().allow(""), // Optional field
    admin_notes: Joi.string().allow(""), // Optional field
  }).required(),
};

export const create_provider_account_refactored_validation = {
  body: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().optional(),
    firstname: Joi.string().trim().min(2).max(50).required(),
    lastname: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),
    medical_licence: Joi.string().allow(null, ""),
    NPI_no: Joi.string().allow(null, ""),
    district_of_columbia: Joi.boolean().allow(null),
    new_york: Joi.boolean().allow(null),
    virginia: Joi.boolean().allow(null),
    maryland: Joi.boolean().allow(null),
    address_1: Joi.string().trim().allow(null, ""),
    address_2: Joi.string().trim().allow(null, ""),
    city: Joi.string().trim().allow(null, ""),
    state: Joi.string().trim().allow(null, ""),
    zip: Joi.string().trim().length(6).allow(null, ""),
    billing_mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),
    business_name: Joi.string().trim().required(),
    business_website: Joi.string().uri().allow(null, ""),
    admin_notes: Joi.string().allow(null, ""),
  }),
  files: Joi.object({
    profile_picture: Joi.allow(Joi.string(), null),
    signature_photo: Joi.allow(Joi.string(), null),
    independent_contractor_agreement: Joi.allow(Joi.string(), null),
    background_check: Joi.allow(Joi.string(), null),
    HIPAA: Joi.allow(Joi.string(), null),
    non_diclosure: Joi.allow(Joi.string(), null),
  }).optional(),
};

export const common_save_provider_account_validation = {
  body: Joi.object({
    user_id: Joi.number().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().optional(),
    firstname: Joi.string().trim().min(2).max(50).required(),
    lastname: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),
    medical_licence: Joi.string().allow(null, ""),
    NPI_no: Joi.string().allow(null, ""),
    synchronization_email:Joi.string().allow(null, ""),
    district_of_columbia: Joi.boolean().allow(null),
    new_york: Joi.boolean().allow(null),
    virginia: Joi.boolean().allow(null),
    maryland: Joi.boolean().allow(null),
    address_1: Joi.string().trim().allow(null, ""),
    address_2: Joi.string().trim().allow(null, ""),
    city: Joi.string().trim().allow(null, ""),
    state: Joi.string().trim().allow(null, ""),
    zip: Joi.string().trim().length(6).allow(null, ""),
    billing_mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),
    business_name: Joi.string().trim().required(),
    business_website: Joi.string().uri().allow(null, ""),
    admin_notes: Joi.string().allow(null, ""),
  }),
  files: Joi.object({
    profile_picture: Joi.allow(Joi.string(), null),
    signature_photo: Joi.allow(Joi.string(), null),
    independent_contractor_agreement: Joi.allow(Joi.string(), null),
    background_check: Joi.allow(Joi.string(), null),
    HIPAA: Joi.allow(Joi.string(), null),
    non_diclosure: Joi.allow(Joi.string(), null),
  }).optional(),
};
