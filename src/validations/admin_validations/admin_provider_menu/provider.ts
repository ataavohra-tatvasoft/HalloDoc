import { Joi } from "celebrate";

export const provider_list_validation = Joi.object({
  region: Joi.string().allow(""), 
  page: Joi.string()
    .required()
    .pattern(/^\d+$/, "page must be a positive integer"),
  pageSize: Joi.string()
    .required()
    .pattern(/^\d+$/, "pageSize must be a positive integer"),
});

export const stop_notification_validation = Joi.object({
  stop_notification_status: Joi.string().valid("yes", "no").required(),
});

export const contact_provider_validation = Joi.object({
  user_id: Joi.string().required(), 
  message: Joi.string().required().min(1), 
 
  email: Joi.string().email().required(), // Require email if mobile_no is absent
  mobile_no: Joi.string()
    .pattern(/^\d+$/, "mobile number must be a string of digits")
    .required(),
});

export const view_edit_physician_account_validation = Joi.object({
  user_id: Joi.string().required(), 
});

export const physician_account_reset_password_validation = {
  body: Joi.object({
    user_id: Joi.string().required(), 
    password: Joi.string()
      .required()
      .min(6)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must be at least 6 characters and contain a lowercase, uppercase, number, and special symbol"
      ),
  }),
};

export const save_account_information_validation = {
  body: Joi.object({
    user_id: Joi.string().required(), 
    username: Joi.string().required(), 
    status: Joi.string().allow(""), 
    role: Joi.string().allow(""), 
  }),
};

export const save_physician_information_validation = {
  body: Joi.object({
    user_id: Joi.string().required(), 
    firstname: Joi.string().required(), 
    lastname: Joi.string().required(), 
    email: Joi.string().email().required(), 
    mobile_no: Joi.string()
      .pattern(/^\d+$/, "mobile number must be a string of digits")
      .required(), 
    medical_licence: Joi.string().allow(""),
    NPI_no: Joi.string().allow(""), 
    synchronization_email: Joi.string().email().allow(""),
    district_of_columbia: Joi.string().optional(),
    new_york: Joi.string().optional(),
    virginia: Joi.string().optional(), 
    maryland: Joi.string().optional(), 
  }),
};

export const save_mailing_billing_info_validation = {
  body: Joi.object({
    user_id: Joi.string().required(), 
    address_1: Joi.string().trim().required(), 
    address_2: Joi.string().trim().allow(""), 
    city: Joi.string().trim().required(),
    state: Joi.string().length(2).uppercase().required(), 
    zip: Joi.string()
      .pattern(/^\d{6}$/, "zip code must be 6 digits")
      .required(),
    billing_mobile_no: Joi.string()
      .pattern(/^\d{10}$/, "mobile number must be a string of 10 digits")
      .allow(""), 
  }),
};

export const save_provider_profile_validation = {
  body: Joi.object({
    user_id: Joi.string().required(), 
    business_name: Joi.string().trim().allow(""), 
    business_website: Joi.string().uri().allow(""), 
    admin_notes: Joi.string().allow(""), 
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
      path: Joi.string().required(),
      mimetype: Joi.string().required(), 
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
        path: Joi.string().required(),
        mimetype: Joi.string().required(), 
    })
  ),
};

export const provider_onboarding_delete_validation= {
  params: Joi.object({
    document_id: Joi.string().required(),
  }),
};
