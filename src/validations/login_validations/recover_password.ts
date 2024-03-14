import { Joi } from 'celebrate';

export const forgotPasswordValidationSchema = {
  body: {
    email: Joi.string().email().required(),
  },
};

export const resetPasswordValidationSchema = {
  body: {
    password: Joi.string().required(),
    reset_token: Joi.string().required(),
  },
};
