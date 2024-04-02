import { Joi } from "celebrate";

export const provider_shifts_list_validation = {
  query: Joi.object({
    region: Joi.string().allow("", null).optional(),
    type_of_shift: Joi.string().allow("", null).optional(),
    page: Joi.number().integer().min(1).optional(),
    page_size: Joi.number().integer().min(1).optional(),
  }),
};

export const provider_on_call_validation = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    page_size: Joi.number().integer().min(1).optional(),
  }),
};

export const requested_shifts_validation = {
  query: Joi.object({
    region: Joi.string().allow("", null).optional(),
    view_current_month_shift: Joi.string().allow("", null).optional(),
    page: Joi.number().integer().min(1).optional(),
    page_size: Joi.number().integer().min(1).optional(),
  }),
};

export const approve_selected_validation = {
  query: Joi.object({
    shift_id: Joi.string().required(),
  }),
};

export const delete_selected_validation = {
  query: Joi.object({
    shift_id: Joi.string().required(),
  }),
};

export const create_shift_validation = {
  body: Joi.object({
    region: Joi.string().required(),
    physician: Joi.string().required(),
    shift_date: Joi.date().required(),
    start: Joi.string().required(),
    end: Joi.string().required(),
    repeat_days: Joi.string().allow("", null).optional(),
    repeat_end: Joi.number().integer().allow(null).optional(),
  }),
};

export const view_shift_validation = {
  query: Joi.object({
    shift_id: Joi.string().required(),
  }),
};
