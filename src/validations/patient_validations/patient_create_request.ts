import { Joi } from 'celebrate'

export const is_patient_registered_validation = {
  body: Joi.object({
    email: Joi.string().email().required()
  })
}

export const create_request_by_patient_validation = {
  body: Joi.object({
    symptoms: Joi.string().allow(''),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    date_of_birth: Joi.string().optional(),
    email: Joi.string().email().required(),
    mobile_no: Joi.string().allow(''),
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().alphanum().optional(),
    zip: Joi.string().allow(''),
    room: Joi.string().allow(''),
    relation_with_patient: Joi.string().allow('').optional(),
    password: Joi.string()
      .min(5)
      .optional()
      // eslint-disable-next-line no-useless-escape
      .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=?{|}\[\]:\'\";,.<>\/\\|\s]).+$/),
    confirm_password: Joi.ref('password')
  })
  // file: Joi.object({
  //   fieldname: Joi.string().optional(),
  // }).optional(),
}

export const create_request_by_family_friend_validation = {
  body: Joi.object({
    your_first_name: Joi.string().required(),
    your_last_name: Joi.string().required(),
    your_mobile_no: Joi.string().allow(''),
    your_email: Joi.string().email().optional(),
    your_relation_with_patient: Joi.string().optional(),
    symptoms: Joi.string().allow(''),
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    date_of_birth: Joi.string().optional(),
    email: Joi.string().email().optional(),
    mobile_no: Joi.string().allow(''),
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().alphanum().optional(),
    zip: Joi.string().allow(''),
    room: Joi.string().allow('')
  })
  // file: Joi.object({
  //   fieldname: Joi.string().optional(),
  // }).optional(),
}

export const create_request_by_concierge_validation = {
  body: Joi.object({
    your_first_name: Joi.string().optional(),
    your_last_name: Joi.string().optional(),
    your_mobile_no: Joi.string().allow(''),
    your_email: Joi.string().email().optional(),
    your_house_name: Joi.string().allow(''),
    your_street: Joi.string().allow(''),
    your_city: Joi.string().allow(''),
    your_state: Joi.string().alphanum().optional(),
    your_zip: Joi.string().allow(''),
    symptoms: Joi.string().allow(''),

    // Patient Details (optional)
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    date_of_birth: Joi.string().optional(),
    email: Joi.string().email().optional(),
    mobile_no: Joi.string().optional().allow(''),
    room: Joi.string().optional().allow(''),
    state: Joi.string().optional().allow('')
  })
}

export const create_request_by_business_validation = {
  body: Joi.object({
    your_first_name: Joi.string().optional(),
    your_last_name: Joi.string().optional(),
    your_mobile_no: Joi.string().allow(''),
    your_email: Joi.string().email().optional(),
    your_property_name: Joi.string().optional(),
    symptoms: Joi.string().allow(''),

    // Patient Details (optional)
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    date_of_birth: Joi.string().optional(),
    email: Joi.string().email().optional(),
    mobile_no: Joi.string().allow(''),
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().alphanum().optional(),
    zip: Joi.string().allow(''),
    room: Joi.string().allow('')
  })
}
