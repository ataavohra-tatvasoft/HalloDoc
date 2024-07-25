import { Joi } from 'celebrate'

export const patient_profile_edit_validation = {
  body: Joi.object({
    type: Joi.string().min(2).max(50).optional(),
    firstname: Joi.string().min(2).max(50).optional(),
    lastname: Joi.string().min(2).max(50).optional(),
    date_of_birth: Joi.date().optional(),
    mobile_no: Joi.string().pattern(/^\d+$/).allow(''),
    email: Joi.string().email().optional(),
    street: Joi.string().optional().allow(''),
    city: Joi.string().optional().allow(''),
    state: Joi.string().alphanum().optional().allow(''),
    zip: Joi.string().optional().allow('')
  })
}

export const create_patient_account_validation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(72)
      .required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')),
    confirm_password: Joi.string().valid(Joi.ref('password')).required()
  })
}
