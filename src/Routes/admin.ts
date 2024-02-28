import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import {
  requests_by_state,
  view_case_for_request,
  requests_by_region,
  block_case_for_request,
  clear_case_for_request,
  view_notes_for_request,
  cancel_case_for_request,
  close_case_for_request,
  send_orders_for_request,
  transfer_request,
  send_agreement,
  assign_request,
  assign_request_region,
  request_support,
  create_request
} from "../controllers";
import { admin_authmiddleware } from "../middlewares";

const router: Router = express.Router();

router.get(
  "/dashboard/requests/:state",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    requests_by_state(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:requestId/requestsbyregion",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    requests_by_region(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:requestId/actions/viewcase",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    view_case_for_request(req, res, next);
  }
);
router.delete(
  "/dashboard/requests/:state/:requestId/actions/clearcase",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    clear_case_for_request(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:requestId/actions/blockcase",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    block_case_for_request(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:requestId/actions/cancelcase",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    cancel_case_for_request(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:requestId/actions/closecase",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    close_case_for_request(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:requestId/actions/viewnotes",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    view_notes_for_request(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:requestId/actions/sendorders",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    send_orders_for_request(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:requestId/actions/transferrequest",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    transfer_request(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:requestId/actions/sendagreement",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    send_agreement(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:requestId/actions/assignrequest/:region",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    assign_request_region(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:requestId/actions/assignrequest",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    assign_request(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/requestsupport",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    request_support(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/createrequest",
  admin_authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    create_request(req, res, next);
  }
);
export default router;
