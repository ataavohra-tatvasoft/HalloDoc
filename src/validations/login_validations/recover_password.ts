import { Joi } from "celebrate";

export const forgot_password_validation_schema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const reset_password_validation_schema = {
  body: Joi.object().keys({
    password: Joi.string()
      .min(5)
      .required()
      .pattern(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=?{|}\[\]:\'\";,.<>\/\\|\s]).+$/
      ),
    confirm_password: Joi.ref("password"),
    reset_token: Joi.string().required(),
  }),
};
