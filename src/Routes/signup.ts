import express, { Router } from "express";
import { Request, Response,NextFunction } from "express";
import { admin_signup } from "../controllers";

const router: Router = express.Router();

router.post('/adminsignup', (req: Request, res: Response, next:NextFunction) => {
  admin_signup(req, res, next);
});

export default router;