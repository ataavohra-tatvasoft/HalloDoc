import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import {
  forgot_password,
  reset_password,
  login,
} from "../controllers";
const router: Router = express.Router();

router.post(
  "/user_login",
  (req: Request, res: Response, next: NextFunction) => {
    login(req, res, next);
  }
);

router.post(
  "/user_forgotpassword",
  (req: Request, res: Response, next: NextFunction) => {
    forgot_password(req, res, next);
  }
);

router.post(
  "/user_resetpassword",
  (req: Request, res: Response, next: NextFunction) => {
    reset_password(req, res, next);
  }
);

export default router;
