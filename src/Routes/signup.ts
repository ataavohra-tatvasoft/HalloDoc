import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { admin_signup } from "../controllers";
import { admin_schema_signup } from "../middlewares";

const router: Router = express.Router();

router.post(
  "/adminsignup",
  admin_schema_signup,
  (req: Request, res: Response, next: NextFunction) => {
    admin_signup(req, res, next);
  }
);

export default router;
