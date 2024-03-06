import Joi, { Schema } from "joi";
import { Request, Response, NextFunction } from "express";
import statusCodes from "../public/status_codes";

export const reset_password_schema = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { password, confirm_password },
  } = req;

  const schema: Schema = Joi.object({
    Password: Joi.string()
      .min(5)
      .required()
      .pattern(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=?{|}\[\]:\'\";,.<>\/\\|\s]).+$/
      ),
    Confirm_Password: Joi.ref("Password"),
  });
  try {
    await schema.validateAsync(
      {
        Password: password,
        Confirm_Password: confirm_password,
      },
      { abortEarly: false }
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
