import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { forgot_password ,  reset_password }  from "../controllers"
const router: Router = express.Router();

router.post(
  "/forgotpassword",
  (req: Request, res: Response, next: NextFunction) => {
    forgot_password (req, res, next);
  }
);

router.post(
  "/resetpassword",
  (req: Request, res: Response, next: NextFunction) => {
    reset_password(req, res, next);
  }
);
export default router;
