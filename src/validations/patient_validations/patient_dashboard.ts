import { Joi } from 'celebrate'

export const medical_history_validation = {
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    page_size: Joi.number().integer().min(1).optional()
  })
}

export const request_action_document_validation = {
  params: Joi.object({
    confirmation_no: Joi.string().required()
  })
}
