import Joi, { Schema } from "joi";
import { Request, Response, NextFunction } from "express";
import statusCodes from "../public/message_constants";


export const admin_profile_info_edit_middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: {
      email,
      confirm_email
    },
  } = req;

  const adminSchema: Schema = Joi.object({
    Email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com"] },
    }),
    Confirm_Email: Joi.ref("Email")
  });

  try {
    await adminSchema.validateAsync(
      {
        Email: email,
        Confirm_Email: confirm_email
      },
      { abortEarly: false, presence: "required" }
    );

    next();
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      errormessage: error.message,
      message: statusCodes[500],
    });
  }
};
