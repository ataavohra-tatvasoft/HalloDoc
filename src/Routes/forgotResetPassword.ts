import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { forgotPassword, resetPassword }  from "../Controllers"
const router: Router = express.Router();

router.post(
  "/forgotpassword",
  (req: Request, res: Response, next: NextFunction) => {
    forgotPassword(req, res, next);
  }
);

router.post(
  "/resetpassword",
  (req: Request, res: Response, next: NextFunction) => {
    resetPassword(req, res, next);
  }
);
export default router;
