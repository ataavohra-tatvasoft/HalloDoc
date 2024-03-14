import { Joi } from 'celebrate';

export const loginValidationSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};