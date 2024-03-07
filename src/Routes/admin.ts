import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import {
  admin_create_request,
  region_without_thirdparty_API,
  region_with_thirdparty_API,
  requests_by_request_state,
  view_case_for_request,
  view_notes_for_request,
  save_view_notes_for_request,
  cancel_case_for_request_view_data,
  cancel_case_for_request,
  assign_request_region_physician,
  assign_request,
  block_case_for_request_view,
  block_case_for_request,
  view_uploads_view_data,
  view_uploads_upload,
  view_uploads_actions_delete,
  view_uploads_actions_download,
  view_uploads_delete_all,
  professions_for_send_orders,
  send_orders_for_request,
  transfer_request_region_physician,
  transfer_request,
  clear_case_for_request,
  send_agreement,
  update_agreement,
  close_case_for_request_view_details,
  close_case_for_request,
  close_case_for_request_edit,
  close_case_for_request_actions_download,
  request_support,
  admin_profile_view,
  admin_profile_reset_password,
  admin_profile_admin_info_edit,
  admin_profile_mailing_billling_info_edit,
  access_accountaccess,
  access_accountaccess_edit,
  access_accountaccess_edit_save,
  access_accountaccess_delete,
  access_useraccess,
  access_useraccess_edit,
  access_useraccess_edit_save,
} from "../controllers";
import { authmiddleware } from "../middlewares";

const router: Router = express.Router();

/**                              Admin in Dashboard                                       */
/**Admin Create Request */
router.post(
  "/dashboard/requests/createrequest",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    admin_create_request(req, res, next);
  }
);
router.get(
  "/dashboard/requests/region",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    region_without_thirdparty_API(req, res, next);
  }
);
router.get(
  "/dashboard/requests/regions",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    region_with_thirdparty_API(req, res, next);
  }
);
router.get(
  "/dashboard/requests",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    requests_by_request_state(req, res, next);
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
router.get(
  "/dashboard/requests/:state/:confirmation_no/actions/viewcancelcase",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    cancel_case_for_request_view_data(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:confirmation_no/actions/cancelcase",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    cancel_case_for_request(req, res, next);
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
router.get(
  "/dashboard/requests/:state/:confirmation_no/actions/viewblockcase",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    block_case_for_request_view(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:confirmation_no/actions/blockcase",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    block_case_for_request(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:confirmation_no/actions/viewuploads/viewdata",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    view_uploads_view_data(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:confirmation_no/actions/viewuploads/upload",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    view_uploads_upload(req, res, next);
  }
);
router.delete(
  "/dashboard/requests/:state/:confirmation_no/actions/viewuploads/delete",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    view_uploads_actions_delete(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:confirmation_no/actions/viewuploads/download/:document_id",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    view_uploads_actions_download(req, res, next);
  }
);
router.delete(
  "/dashboard/requests/:state/:confirmation_no/actions/viewuploads/deleteall",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    view_uploads_delete_all(req, res, next);
  }
);
router.get(
  "/dashboard/requests/actions/sendorders/professions",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    professions_for_send_orders(req, res, next);
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
  "/dashboard/requests/:state/actions/transferrequestregionphysician/:region",
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
router.delete(
  "/dashboard/requests/:state/:confirmation_no/actions/clearcase",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    clear_case_for_request(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:confirmation_no/actions/sendagreement",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    send_agreement(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:confirmation_no/actions/updateagreement",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    update_agreement(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:confirmation_no/actions/closecase/viewdetails",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    close_case_for_request_view_details(req, res, next);
  }
);
router.put(
  "/dashboard/requests/:state/:confirmation_no/actions/closecase",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    close_case_for_request(req, res, next);
  }
);
router.post(
  "/dashboard/requests/:state/:confirmation_no/actions/closecase/edit",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    close_case_for_request_edit(req, res, next);
  }
);
router.get(
  "/dashboard/requests/:state/:confirmation_no/actions/closecase/actions/download/:document_id",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    close_case_for_request_actions_download(req, res, next);
  }
);
/** Clear case and admin profile are not giving proper outputs */

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
  "/dashboard/requests/admin_profile/view",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    admin_profile_view(req, res, next);
  }
);
router.put(
  "/dashboard/requests/admin_profile/resetpassword",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    admin_profile_reset_password(req, res, next);
  }
);
router.post(
  "/dashboard/requests/admin_profile/editadmininfo",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    admin_profile_admin_info_edit(req, res, next);
  }
);
router.post(
  "/dashboard/requests/admin_profile/editbillingfinfo",
  authmiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    admin_profile_mailing_billling_info_edit(req, res, next);
  }
);

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
