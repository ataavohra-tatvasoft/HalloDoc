import { Joi } from 'celebrate'

/**Exports API */
export const export_single_validation = {
  query: Joi.object({
    state: Joi.string()
      .trim()
      .required()
      .valid('new', 'pending', 'active', 'conclude', 'toclose', 'unpaid'),
    search: Joi.string().trim().optional().allow(''), // Allow empty string for search
    region: Joi.string().trim().optional().allow(''), // Allow empty string for region
    requestor: Joi.string().trim().optional().allow(''), // Allow empty string for requestor
    page: Joi.number().integer().positive().optional(),
    page_size: Joi.number().integer().positive().optional()
  })
}
export const export_all_validation = {
  query: Joi.object({
    search: Joi.string().trim().optional().allow(''), // Allow empty string for search
    region: Joi.string().trim().optional().allow(''), // Allow empty string for region
    requestor: Joi.string().trim().optional().allow(''), // Allow empty string for requestor
    page: Joi.number().integer().positive().optional(),
    page_size: Joi.number().integer().positive().optional()
  })
}
export const export_single_physician_validation = {
  query: Joi.object({
    state: Joi.string().trim().required().valid('new', 'pending', 'active', 'conclude'),
    search: Joi.string().trim().optional().allow(''),
    region: Joi.string().trim().optional().allow(''),
    requestor: Joi.string().trim().optional().allow(''),
    page: Joi.number().integer().positive().optional(),
    page_size: Joi.number().integer().positive().optional()
  })
}
export const export_all_physician_validation = {
  query: Joi.object({
    search: Joi.string().trim().optional().allow(''),
    region: Joi.string().trim().optional().allow(''),
    requestor: Joi.string().trim().optional().allow(''),
    page: Joi.number().integer().positive().optional(),
    page_size: Joi.number().integer().positive().optional()
  })
}
export const export_records_validation = {
  // Query parameters
  query: Joi.object({
    request_status: Joi.string().allow('').optional(),
    patient_name: Joi.string().allow('').optional(),
    request_type: Joi.string().allow('').optional(),
    from_date_of_service: Joi.any().allow('').optional(),
    to_date_of_service: Joi.any().allow('').optional(),
    provider_name: Joi.string().allow('').optional(),
    email: Joi.string().email().allow('').optional(),
    phone_no: Joi.string()
      .trim()
      .allow('')
      .pattern(/^\d{11,13}$/)
      .optional(),
    page: Joi.string().optional().pattern(/^\d+$/, 'page must be a positive integer'),
    page_size: Joi.string().optional().pattern(/^\d+$/, 'page_size must be a positive integer')
  }).optional(),

  // Empty body (optional)
  body: Joi.object().allow({}) // Allow an empty object for the body
}

/**Action's API */
export const actions_validation = {
  params: Joi.object({
    confirmation_no: Joi.string()
      .trim()
      .required()
      .error(new Error('Confirmation number is required'))
  })
}

/**Physician's API */
export const create_shift_region_physicians_validation = {
  query: Joi.object({
    region: Joi.string().allow('').optional()
  })
}

/**Role's API */

export const roles_validation = {
  query: Joi.object({
    account_type: Joi.string().trim().optional().allow('')
  })
}
