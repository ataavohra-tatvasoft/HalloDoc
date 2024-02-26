import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { getRequestsByState } from "../Controllers/adminRequestByState";
import { getViewCaseForRequest } from "../Controllers/adminGetRequestViewCase";

const router: Router = express.Router();

router.get('/dashboard/requests/:state', (req: Request, res: Response, next: NextFunction) => {
    getRequestsByState(req, res, next);
});
router.get('/dashboard/requests/:requestId/viewcase',(req: Request, res: Response, next: NextFunction) => {
    getViewCaseForRequest(req, res, next); 
  });
  

export default router;