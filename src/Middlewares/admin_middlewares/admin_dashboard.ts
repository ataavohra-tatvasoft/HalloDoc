import Joi, { Schema } from "joi";
import { Request, Response, NextFunction } from "express";

export const requests_by_request_state_validation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { state, firstname, lastname, region, requestor, page, pageSize } =
    req.query as {
      state: string;
      firstname: string;
      lastname: string;
      region: string;
      requestor: string;
      page: string;
      pageSize: string;
    };

  const schema: Schema = Joi.object({
    state: Joi.string()
      .valid("new", "pending", "active", "conclude", "toclose", "unpaid")
      .required(),
    firstname: Joi.string().allow(""), 
    lastname: Joi.string().allow(""),
    region: Joi.string().allow(""), 
    requestor: Joi.string().allow(""), 
    page: Joi.string()
      .allow("")
      .optional()
      .custom((value, helper) => {
        if (value && !parseInt(value)) {
          return helper.error("page must be a valid integer");
        }
        return value;
      }),
    pageSize: Joi.string()
      .allow("")
      .optional()
      .custom((value, helper) => {
        if (value && !parseInt(value)) {
          return helper.error("pageSize must be a valid integer");
        }
        return value;
      }),
  });

  try {

    const { error } = await schema.validateAsync(req.query, { abortEarly: false });

    if (error) {
      return res.status(400).json({ message: error.details[0].message }); // Specific error message
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const cancel_case_validation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const schema: Schema = Joi.object({
      confirmation_no: Joi.string()
        .required()
        .length(12),
      body: Joi.object({
        reason: Joi.string().required().message("Reason for cancellation is required"), 
        additional_notes: Joi.string().allow(""),
      }),
    });
  
    try {
      const { error } = await schema.validateAsync(req, { abortEarly: false });
  
      if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({ message: errorMessage });
      }
  
      next(); 
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };