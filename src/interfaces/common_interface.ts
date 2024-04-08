import { Request, Response, NextFunction } from "express";

export type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export type FormattedResponse<T> = { status: boolean; data: T[] };

export type verified_token = {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  type_of_user: string;
  role_id: number;
  iat: number
};

export interface MyError extends Error {
  message: string;
}

// export type FormattedRequest = { region_name: string };
