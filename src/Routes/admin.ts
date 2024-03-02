import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import {
  requests_by_request_state,
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
  create_request,
  save_view_notes_for_request,
  transfer_request_region,
  close_case_for_request_edit,
  admin_profile
} from "../controllers";
import {authmiddleware} from "../middlewares"
const router: Router = express.Router();


router.post(
  "/dashboard/requests/createrequest",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    create_request(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    requests_by_request_state(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:region/requestsbyregion",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    requests_by_region(req, res, next);
  }
);
router.put(
  "/dashboard/requests/requestsupport",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    request_support(req, res, next);
  }
);
router.get(
  "/dashboard/requests/admin_profile",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    admin_profile(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:confirmation_no/actions/viewcase",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    view_case_for_request(req, res, next);
  }
);
router.delete(
  "/dashboard/requests/:state/:confirmation_no/actions/clearcase",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    clear_case_for_request(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:confirmation_no/actions/blockcase",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    block_case_for_request(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:confirmation_no/actions/cancelcase",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    cancel_case_for_request(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:confirmation_no/actions/closecase",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    close_case_for_request(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:confirmation_no/actions/closecase_edit",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    close_case_for_request_edit(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:confirmation_no/actions/viewnotes/:notes_for",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    view_notes_for_request(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:confirmation_no/actions/viewnotes/",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    save_view_notes_for_request(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:confirmation_no/actions/sendorders",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    send_orders_for_request(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:confirmation_no/actions/transferrequestregion/:region",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    transfer_request_region(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:confirmation_no/actions/transferrequest",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    transfer_request(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:confirmation_no/actions/sendagreement",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    send_agreement(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:confirmation_no/actions/assignrequest/:region",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    assign_request_region(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:confirmation_no/actions/assignrequest",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    assign_request(req, res, next);
  }
);

export default router;
