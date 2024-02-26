import Joi, { Schema } from "joi";
import { Request, Response, NextFunction } from "express";
import statusCodes from "../public/statusCodes";

export const requestSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: {
      request_state,
      patient_id,
      firstname,
      lastname,
      dob,
      mobile_number,
      email,
      street,
      city,
      state,
      zip,
      requested_by,
      requestor_id,
      requestor_name,
      requested_date,
      address,
      notes,
      region,
      physician_name,
      date_of_service,
      block_status,
    },
  } = req;

  const schema: Schema = Joi.object({
    request_state: Joi.string().valid(
      "new",
      "pending",
      "conclude",
      "unpaid",
      "active",
      "toclose"
    ).required(),
    patient_id: Joi.number().integer().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    dob: Joi.date().required(),
    mobile_number: Joi.number().integer().min(1000000000).max(9999999999).required(),
    email: Joi.string().email().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.number().integer().min(100000).max(999999).required(),
    requested_by: Joi.string().valid("concierge", "family_friend", "business_partner").required(),
    requestor_id: Joi.number().integer().required(),
    requestor_name: Joi.string().required(),
    requested_date: Joi.date().required(),
    address: Joi.string().required(),
    notes: Joi.string().allow(null),
    region: Joi.string().valid("ahmedabad", "anand", "nadiad").required(),
    physician_name: Joi.string().required(),
    date_of_service: Joi.date().required(),
    block_status: Joi.string().valid("yes", "no").required(),
  });

  try {
    await schema.validateAsync({ request_state,
        patient_id,
        firstname,
        lastname,
        dob,
        mobile_number,
        email,
        street,
        city,
        state,
        zip,
        requested_by,
        requestor_id,
        requestor_name,
        requested_date,
        address,
        notes,
        region,
        physician_name,
        date_of_service,
        block_status,},
         { abortEarly: false });

    next();
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      errormessage: error.message,
      message: statusCodes[500],
    });
  }
};
