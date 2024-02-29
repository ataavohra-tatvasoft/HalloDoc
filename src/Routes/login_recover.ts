import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import {
  forgot_password,
  reset_password,
  patient_forgot_password,
  patient_reset_password,
  login,
  patient_login,
} from "../controllers";
const router: Router = express.Router();

router.post(
  "/admin_provider_login",
  (req: Request, res: Response, next: NextFunction) => {
    login(req, res, next);
  }
);

router.post(
  "/patientlogin",
  (req: Request, res: Response, next: NextFunction) => {
    patient_login(req, res, next);
  }
);
router.post(
  "/admin_provider/forgotpassword",
  (req: Request, res: Response, next: NextFunction) => {
    forgot_password(req, res, next);
  }
);

router.post(
  "/admin_provider/resetpassword",
  (req: Request, res: Response, next: NextFunction) => {
    reset_password(req, res, next);
  }
);
router.post(
  "/patient/forgotpassword",
  (req: Request, res: Response, next: NextFunction) => {
    patient_forgot_password(req, res, next);
  }
);

router.post(
  "/patient/resetpassword",
  (req: Request, res: Response, next: NextFunction) => {
    patient_reset_password(req, res, next);
  }
);
export default router;
