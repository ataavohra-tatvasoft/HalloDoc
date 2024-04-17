import { Joi } from "celebrate";

export const provider_provider_shifts_list_validation = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    page_size: Joi.number().integer().min(1).optional(),
  }).oxor("page", "page_size"),
};

export const provider_create_shift_validation = {
  body: Joi.object({
    region: Joi.string().required(),
    shift_date: Joi.date().iso().required(),
    start: Joi.string().required(),
    end: Joi.string().required(),
    repeat_days: Joi.string().optional(),
    repeat_end: Joi.number().optional(),
  }),
};

export const provider_view_shift_validation = {
  query: Joi.object({
    shift_id: Joi.number().integer().required().min(1),
  }),
};

export const provider_edit_shift_validation = {
  body: Joi.object({
    shift_id: Joi.number().integer().required().min(1),
    region: Joi.string().optional(),
    shift_date: Joi.date().iso().optional(),
    start: Joi.string().optional(),
    end: Joi.string().optional(),
  }),
};
