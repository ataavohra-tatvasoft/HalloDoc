import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { admin_login, patient_login, provider_login } from "../controllers";

const router: Router = express.Router();

router.post(
  "/adminlogin",
  (req: Request, res: Response, next: NextFunction) => {
    admin_login(req, res, next);
  }
);

router.post(
  "/patientlogin",
  (req: Request, res: Response, next: NextFunction) => {
    patient_login(req, res, next);
  }
);

router.post(
  "/providerlogin",
  (req: Request, res: Response, next: NextFunction) => {
    provider_login(req, res, next);
  }
);

export default router;
