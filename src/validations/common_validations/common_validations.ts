import { Joi } from "celebrate";

/**Exports API */
export const export_single_validation = {
  query: Joi.object({
    state: Joi.string()
      .trim()
      .required()
      .valid("new", "pending", "active", "conclude", "toclose", "unpaid"),
    search: Joi.string().trim().optional().allow(""), // Allow empty string for search
    region: Joi.string().trim().optional().allow(""), // Allow empty string for region
    requestor: Joi.string().trim().optional().allow(""), // Allow empty string for requestor
    page: Joi.number().integer().positive().optional(),
    page_size: Joi.number().integer().positive().optional(),
  }),
};
export const export_all_validation = {
  query: Joi.object({
    search: Joi.string().trim().optional().allow(""), // Allow empty string for search
    region: Joi.string().trim().optional().allow(""), // Allow empty string for region
    requestor: Joi.string().trim().optional().allow(""), // Allow empty string for requestor
    page: Joi.number().integer().positive().optional(),
    page_size: Joi.number().integer().positive().optional(),
  }),
};

/**Action's API */
export const actions_validation = {
  params: Joi.object({
    confirmation_no: Joi.string()
      .trim()
      .required()
      .error(new Error("Confirmation number is required")),
  }),
};

/**Role's API */

export const roles_validation = {
  query: Joi.object({
    account_type: Joi.string().trim().optional().allow(""),
  }),
};
