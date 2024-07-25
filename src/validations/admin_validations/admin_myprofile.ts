import { Joi } from 'celebrate'

export const admin_profile_reset_password_validation_schema = {
  body: Joi.object({
    password: Joi.string().required(),
    user_id: Joi.number().integer().positive().required()
  })
}

export const admin_profile_edit_validation = {
  body: Joi.object({
    user_id: Joi.number().integer().positive().required(),
    firstname: Joi.string().trim().min(2).max(50).optional(),
    lastname: Joi.string().trim().min(2).max(50).optional(),
    email: Joi.string().email().lowercase().optional(),
    confirm_email: Joi.ref('email'),
    mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),

    // Optional address fields
    address_1: Joi.string().trim().allow(null, '').optional(),
    address_2: Joi.string().trim().allow(null, '').optional(),
    city: Joi.string().trim().allow(null, '').optional(),
    state: Joi.string().trim().allow(null, '').optional(),
    zip: Joi.string().trim().length(6).allow(null, '').optional(),

    billing_mobile_no: Joi.string()
      .trim()
      .pattern(/^\d{11,13}$/)
      .optional(),

    // district_of_columbia: Joi.boolean().allow(null).optional(),
    // new_york: Joi.boolean().allow(null).optional(),
    // virginia: Joi.boolean().allow(null).optional(),
    // maryland: Joi.boolean().allow(null).optional(),

    region_ids: Joi.array().items(Joi.number().integer().positive().required()).optional()
  })
}
