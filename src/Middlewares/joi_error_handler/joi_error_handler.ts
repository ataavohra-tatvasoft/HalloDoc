import { NextFunction, Request, Response } from "express";
const celebrate = require('celebrate');
// import { ValidationError } from "joi";

export const handle_joi_errors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof celebrate.CelebrateError) {
    // Handle Celebrate validation errors
    const { details } = err;

    res.status(err.statusCode || 400).json({
      message: "Validation failed",
      errors: details.reduce((acc:any, error:any) => {
        const {
          message,
          context: { key },
        } = error;
        acc[key] = message;
        return acc;
      }, {}),
    });
  } else {

    next(err);
  }
};
