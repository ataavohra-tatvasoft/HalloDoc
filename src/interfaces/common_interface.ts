import { Request, Response, NextFunction } from "express";

export type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export type FormattedResponse<T> = {
  status: boolean;
  confirmation_no?: string;
  data: T[];
};

export type FormattedResponse_2<T> = {
  status: boolean;
  provider_on_call: T[];
  provider_off_duty: T[];
};

export type VerifiedToken = {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  type_of_user: string;
  role_id: number;
  iat: number;
};
export interface MyError extends Error {
  message: string;
}
export interface File {
  fieldname: string;
  path: string;
}
