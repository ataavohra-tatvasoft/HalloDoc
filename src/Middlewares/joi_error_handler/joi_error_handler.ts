import { NextFunction, Request, Response } from 'express';
import {  ValidationError } from 'joi'; // Import Joi.Error type

export const handle_joi_errors = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err && (err as ValidationError).isJoi) { // Type assertion
      const { details } = err as ValidationError; // Type assertion
      const validationErrors = details.map((detail) => detail.message);
  
      return res.status(400).json({
        status: false,
        errors: validationErrors,
      });
    }
  };
  