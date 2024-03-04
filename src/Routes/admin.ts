import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import {
  requests_by_request_state,
  requests_by_request_state_regions,
  view_case_for_request,
  block_case_for_request,
  clear_case_for_request,
  view_notes_for_request,
  cancel_case_for_request,
  close_case_for_request,
  send_orders_for_request,
  transfer_request,
  send_agreement,
  assign_request,
  assign_request_region_physician,
  assign_request_regions,
  request_support,
  create_request,
  save_view_notes_for_request,
  transfer_request_regions,
  transfer_request_region_physician,
  close_case_for_request_edit,
  admin_profile,
  access_accountaccess,
  access_accountaccess_edit,
  access_accountaccess_edit_save,
  access_accountaccess_delete,
  access_useraccess,
  access_useraccess_edit,
  access_useraccess_edit_save
} from "../controllers";
import {authmiddleware} from "../middlewares"
const router: Router = express.Router();


/**                              Admin in Dashboard                                       */
/**Admin Create Request */
router.post(
  "/dashboard/requests/createrequest",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    create_request(req, res, next);
  }
);

/**Admin request by request_state and region */
router.get(
  "/dashboard/requests/:state",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    requests_by_request_state_regions(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:region",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    requests_by_request_state(req, res, next);
  }
);

/**Admin Request Support */
router.put(
  "/dashboard/requests/requestsupport",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    request_support(req, res, next);
  }
);

/**Admin Profile */
router.get(
  "/dashboard/requests/admin_profile",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    admin_profile(req, res, next);
  }
);


/**Admin Request Actions */
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
  "/dashboard/requests/:state/:confirmation_no/actions/viewnotes",
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
  "/dashboard/requests/:state/:confirmation_no/actions/transferrequestregions",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    transfer_request_regions(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:confirmation_no/actions/transferrequestregionphysician/:region",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    transfer_request_region_physician(req, res, next);
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
  "/dashboard/requests/:state/:confirmation_no/actions/assignrequestregion",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    assign_request_regions(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:confirmation_no/actions/assignrequestregionphysician/:region",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    assign_request_region_physician(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:confirmation_no/actions/assignrequest",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    assign_request(req, res, next);
  }
);

/** Clear case and admin profile are not giving proper outputs */



/**                             Admin in Access Roles                                     */
/** Admin Account Access */
router.get(
  "/access/accountaccess",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    access_accountaccess(req, res, next);
  }
);
router.get(
  "/access/accountaccess/:account_id/edit",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    access_accountaccess_edit(req, res, next);
  }
);
router.put(
  "/access/accountaccess/:account_id/edit/save",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    access_accountaccess_edit_save(req, res, next);
  }
);
router.delete(
  "/access/accountaccess/:account_id/delete",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    access_accountaccess_delete(req, res, next);
  }
);

/** Admin User Access */
router.get(
  "/access/useraccess",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    access_useraccess(req, res, next);
  }
);
router.get(
  "/access/useraccess/:account_id/edit",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    access_useraccess_edit(req, res, next);
  }
);
router.put(
  "/access/useraccess/:account_id/edit/save",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    access_useraccess_edit_save(req, res, next);
  }
);


/**                             Admin in Provider Menu                                    */


export default router;