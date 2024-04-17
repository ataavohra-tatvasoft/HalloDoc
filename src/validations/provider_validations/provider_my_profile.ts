import { Joi } from "celebrate";

export const provider_profile_reset_password_validation = {
  body: Joi.object({
    password: Joi.string().required(),
  }),
};

export const provider_provider_profile_upload_validation = {
  files: Joi.array().items(
    Joi.object({
      fieldname: Joi.string()
        .valid("profile_picture", "signature_photo")
        .required(),
    })
  ),
};

export const provider_request_to_admin_validation = {
  body: Joi.object({
    message: Joi.string().required().min(1),
  }),
};
