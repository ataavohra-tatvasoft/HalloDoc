import { Joi } from "celebrate";

/** Admin MyProfileMenu*/

export const admin_profile_admin_info_edit_validation = {
  body: Joi.object({
    firstname: Joi.string().trim().required(),
    lastname: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    confirm_email: Joi.ref("email"),
    mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),
    district_of_columbia: Joi.boolean().optional(),
    new_york: Joi.boolean().optional(),
    virginia: Joi.boolean().optional(),
    maryland: Joi.boolean().optional(),
    user_id: Joi.number().required(),
  }).required(),
};
export const admin_profile_mailing_billling_info_edit_validation = {
  body: Joi.object({
    user_id: Joi.number().required(),
    address_1: Joi.string().trim().required(),
    address_2: Joi.string().trim().allow(""), // Optional field
    city: Joi.string().trim().required(),
    state: Joi.string().length(2).uppercase().required(),
    zip: Joi.string()
      .length(5)
      .pattern(/^[0-9]+$/)
      .required(),
    billing_mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),
  }),
};

/**AdminProviderMenu */
/**Provider */

//Combined below four API validation into above one for API validation named save_user_information
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
      .trim()
      .pattern(/^\d{11,13}$/)
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
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),
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
