import express, { Router } from "express";
import { Request, Response } from "express";
import { adminLogin } from "../Controllers/adminLoginController";

const router: Router = express.Router();

router.post('/adminLogin', (req: Request, res: Response, next:any) => {
  adminLogin(req, res, next);
});

export default router;