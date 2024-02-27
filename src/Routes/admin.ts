import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { getRequestsByState } from "../Controllers";
import {
  getViewCaseForRequest,
  getRequestsByRegion,
  putBlockCaseForRequest,
  deleteClearCaseForRequest,
  getViewNotesForRequest,
  putCancelCaseForRequest,
  putCloseCaseForRequest,
  postSendOrdersForRequest,
  postTransferRequest,
  postSendAgreement,
  putAssignRequest,
  postRequestSupport
} from "../Controllers";
import { adminauthmiddleware } from "../Middlewares";

const router: Router = express.Router();

router.get(
  "/dashboard/requests/:state",
  adminauthmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getRequestsByState(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:requestId/requestsbyregion",
  adminauthmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getRequestsByRegion(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:requestId/actions/viewcase",
  adminauthmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getViewCaseForRequest(req, res, next);
  }
);
router.delete(
  "/dashboard/requests/:state/:requestId/actions/clearcase",
  adminauthmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    deleteClearCaseForRequest(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:requestId/actions/blockcase",
  adminauthmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    putBlockCaseForRequest(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:requestId/actions/cancelcase",
  adminauthmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    putCancelCaseForRequest(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:requestId/actions/closecase",
  adminauthmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    putCloseCaseForRequest(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:requestId/actions/viewnotes",
  adminauthmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getViewNotesForRequest(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:requestId/actions/sendorders",
  adminauthmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    postSendOrdersForRequest(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:requestId/actions/transferrequest",
  adminauthmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    postTransferRequest(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:requestId/actions/sendagreement",
  adminauthmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    postSendAgreement(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:requestId/actions/assignrequest",
  adminauthmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    putAssignRequest(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/requestsupport",
  adminauthmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    postRequestSupport(req, res, next);
  }
);
export default router;
