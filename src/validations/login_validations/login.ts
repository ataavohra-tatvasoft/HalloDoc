import { Joi } from 'celebrate'

export const login_validation_schema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
}
