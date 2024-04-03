import { Joi } from "celebrate";

export const requests_by_request_state_provider_validation = {
  query: Joi.object({
    state: Joi.string().valid("new", "pending", "conclude", "active"),
    search: Joi.string().optional().allow(""),
    requestor: Joi.string().optional().allow(""),
    page: Joi.number().integer().min(1).default(1),
    page_size: Joi.number().integer().min(1).default(10),
  }),
};

export const provider_accept_request_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required().min(1), // You can adjust minimum length based on your confirmation number format
  }),
};

export const transfer_request_provider_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required().min(1),
  }),

  body: Joi.object({
    description: Joi.string().required().min(1),
  }),
};
