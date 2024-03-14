import { Joi } from 'celebrate';

export const manageRequestsByStateValidation = Joi.object({
  state: Joi.string().valid(
    'new',
    'pending',
    'active',
    'conclude',
    'toclose',
    'unpaid'
  ).required(),
  firstname: Joi.string(),
  lastname: Joi.string(),
  region: Joi.string(),
  requestor: Joi.string(),
  page: Joi.number().integer().min(1),
  pageSize: Joi.number().integer().min(1),
});
