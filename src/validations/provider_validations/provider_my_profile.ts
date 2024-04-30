import { Joi } from "celebrate";
import { query } from "express";

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

export const provider_myprofile_onboarding_upload_validation = {
  body: Joi.object().optional(),
  files: Joi.array().items(
    Joi.object({
      fieldname: Joi.string()
        .valid("provider_agreement", "independent_contractor_agreement")
        .required(),
    })
  ),
};

export const provider_myprofile_onboarding_view_validation = {
  // params: Joi.object({
  //   document_id: Joi.number().required(),
  // }),
  query: Joi.object({
    provider_agreement: Joi.boolean().optional(),
    HIPAA: Joi.boolean().optional(),
  }),
};

export const provider_myprofile_onboarding_delete_validation = {
  params: Joi.object({
    document_id: Joi.string().required().uuid(),
  }),
};
