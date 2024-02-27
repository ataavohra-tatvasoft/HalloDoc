import express, { Router } from "express";
import { Request, Response,NextFunction } from "express";
import { adminSignup } from "../Controllers";

const router: Router = express.Router();

router.post('/adminSignup', (req: Request, res: Response, next:NextFunction) => {
  adminSignup(req, res, next);
});

export default router;