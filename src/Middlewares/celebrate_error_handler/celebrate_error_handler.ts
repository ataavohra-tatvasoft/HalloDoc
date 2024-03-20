import { errors } from "celebrate";
import { NextFunction, Request, Response } from "express";
const celebrate = require("celebrate");
// import { ValidationError } from "joi";

export const handle_joi_errors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof celebrate.CelebrateError) {
    console.log(err);
    const { details } = err;

    // Check if details is an array before using reduce
    if (Array.isArray(details)) {
      var errors = details.reduce((acc, error) => {
        const {
          message,
          context: { key },
        } = error;
        acc[key] = message;
        return acc;
      }, {});
    } else {
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    }

    return res.status(err.statusCode || 400).json({
      message: "Validation failed",
      error: errors,
    });
  } else {
    next(err);
  }
};
