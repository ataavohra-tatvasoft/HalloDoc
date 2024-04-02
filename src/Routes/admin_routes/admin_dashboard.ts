import express, { Router } from "express";
import { celebrate, Joi } from "celebrate";
import {
  admin_create_request,
  admin_create_request_verify,
  view_case_for_request,
  view_notes_for_request,
  save_view_notes_for_request,
  cancel_case_for_request_view_data,
  cancel_case_for_request,
  assign_request_region_physician,
  assign_request,
  block_case_for_request_view,
  block_case_for_request_post,
  view_uploads_view_data,
  view_uploads_upload,
  view_uploads_actions_delete,
  view_uploads_actions_download,
  view_uploads_delete_all,
  business_name_for_send_orders,
  view_send_orders_for_request,
  send_orders_for_request,
  transfer_request,
  clear_case_for_request,
  send_agreement,
  update_agreement,
  close_case_for_request_view_details,
  close_case_for_request,
  close_case_for_request_edit,
  close_case_for_request_actions_download,
  request_support,
  transfer_request_region_physicians,
  view_uploads_download_all,
  admin_send_link,
  manage_requests_by_State,
  requests_by_request_state,
  requests_by_request_state_refactored,
  requests_by_request_state_counts,
  regions,

} from "../../controllers";
import {
  region_with_thirdparty_API,
  professions_for_send_orders,
  transfer_request_regions,
  region_for_request_states,
} from "../../controllers";
import { authmiddleware } from "../../middlewares";
import {
  manage_requests_by_state_validation,
  view_case_validation,
  view_notes_for_request_validation,
  save_view_notes_for_request_validation,
  cancel_case_for_request_view_data_validation,
  cancel_case_for_request_validation,
  assign_request_region_physician_validation,
  assign_request_validation,
  block_case_for_request_view_validation,
  block_case_for_request_post_validation,
  view_uploads_view_data_validation,
  view_uploads_upload_validation,
  view_uploads_actions_delete_validation,
  view_uploads_actions_download_validation,
  view_uploads_delete_all_validation,
  view_uploads_download_all_validation,
  business_name_for_send_orders_validation,
  view_send_orders_for_request_validation,
  send_orders_for_request_validation,
  transfer_request_region_physicians_validation,
  transfer_request_validation,
  clear_case_for_request_validation,
  send_agreement_validation,
  update_agreement_validation,
  close_case_for_request_validation,
  close_case_for_request_view_details_validation,
  close_case_for_request_edit_validation,
  close_case_for_request_actions_download_validation,
  request_support_validation,
  admin_send_link_validation,
  admin_create_request_validation,
  admin_create_request_verify_validation
} from "../../validations";
import { upload } from "../../utils";
const router: Router = express.Router();


/**                              Admin in Dashboard                                       */

/**Admin Create Request */
router.post(
  "/dashboard/requests/createrequestverify",
  authmiddleware,
  celebrate(admin_create_request_verify_validation),
  admin_create_request_verify
);
router.post(
  "/dashboard/requests/createrequest",
  authmiddleware,
  celebrate(admin_create_request_validation),
  admin_create_request
);

//Regions
router.get(
  "/dashboard/requests/regions",
  authmiddleware,
  region_with_thirdparty_API
);


/**
 * @description This route handles various actions related to requests based on their state.
 */
router.get(
  "/dashboard/requestsregion",
  authmiddleware,
  regions
);
router.get(
  "/dashboard/requestsandcounts",
  authmiddleware,
  celebrate(manage_requests_by_state_validation),
  manage_requests_by_State
);
//Below two API's are combined in above API
router.get(
  "/dashboard/requestscount",
  authmiddleware,
  requests_by_request_state_counts
);
router.get(
  "/dashboard/requests",
  authmiddleware,
  requests_by_request_state_refactored
);

/**Admin Request Actions */

/**
 * @description Given below are Express routes that allows viewing request by confirmation number.
 */
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewcase",
  authmiddleware,
  celebrate(view_case_validation),
  view_case_for_request
);

/**
 * @description Given below are Express routes that allows viewing and saving notes for a request identified by the confirmation number.
 */
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewnotes",
  authmiddleware,
  celebrate(view_notes_for_request_validation),
  view_notes_for_request
);
router.put(
  "/dashboard/requests/:confirmation_no/actions/viewnotes",
  authmiddleware,
  celebrate(save_view_notes_for_request_validation),
  save_view_notes_for_request
);

/**
 * @description Given below are Express routes that allows canceling a case for a request identified by the confirmation number.
 */
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewcancelcase",
  authmiddleware,
  celebrate(cancel_case_for_request_view_data_validation),
  cancel_case_for_request_view_data
);
router.put(
  "/dashboard/requests/:confirmation_no/actions/cancelcase",
  authmiddleware,
  celebrate(cancel_case_for_request_validation),
  cancel_case_for_request
);

/**
 * @description Given below are Express routes that allows viewing and assigning requests to a physician.
 */
router.get(
  "/dashboard/requests/:confirmation_no/actions/assignrequestphysicians",
  authmiddleware,
  celebrate(assign_request_region_physician_validation),
  assign_request_region_physician
);
router.put(
  "/dashboard/requests/:confirmation_no/actions/assignrequest",
  authmiddleware,
  celebrate(assign_request_validation),
  assign_request
);

/**
 * @description Given below are Express routes that allows blocking a case for a request identified by the confirmation number and viewing the corresponding patient data.
 */
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewblockcase",
  authmiddleware,
  celebrate(block_case_for_request_view_validation),
  block_case_for_request_view
);
router.put(
  "/dashboard/requests/:confirmation_no/actions/blockcase",
  authmiddleware,
  celebrate(block_case_for_request_post_validation),
  block_case_for_request_post
);

/**
 * @description These handles various actions related to uploads for a request.
 */
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewuploads/viewdata",
  authmiddleware,
  celebrate(view_uploads_view_data_validation),

  view_uploads_view_data
);
router.post(
  "/dashboard/requests/:confirmation_no/actions/viewuploads/upload",
  authmiddleware,
  celebrate(view_uploads_upload_validation),
  upload.single("file"),
  view_uploads_upload
);
router.delete(
  "/dashboard/requests/:confirmation_no/actions/viewuploads/delete/:document_id",
  authmiddleware,
  celebrate(view_uploads_actions_delete_validation),
  view_uploads_actions_delete
);
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewuploads/download/:document_id",
  authmiddleware,
  celebrate(view_uploads_actions_download_validation),
  view_uploads_actions_download
);
router.delete(
  "/dashboard/requests/:confirmation_no/actions/viewuploads/deleteall",
  authmiddleware,
  celebrate(view_uploads_delete_all_validation),
  view_uploads_delete_all
);
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewuploads/downloadall",
  authmiddleware,
  celebrate(view_uploads_download_all_validation),
  view_uploads_download_all
);

/**
 * @description These handles viewing and sending orders for a request.
 */
router.get(
  "/dashboard/requests/actions/sendorders/professions",
  authmiddleware,
  professions_for_send_orders
);
router.get(
  "/dashboard/requests/actions/sendorders/businesses",
  authmiddleware,
  celebrate(business_name_for_send_orders_validation),
  business_name_for_send_orders
);
router.get(
  "/dashboard/requests/actions/viewsendorders",
  authmiddleware,
  celebrate(view_send_orders_for_request_validation),
  view_send_orders_for_request
);
router.post(
  "/dashboard/requests/:state/:confirmation_no/actions/sendorders",
  authmiddleware,
  celebrate(send_orders_for_request_validation),
  send_orders_for_request
);

/**
 * @description Given below are Express routes that allows viewing and transfer request to a different physician.
 */
router.get(
  "/dashboard/requests/actions/transferrequestregions",
  authmiddleware,
  regions
);
router.get(
  "/dashboard/requests/actions/transferrequestphysicians",
  authmiddleware,
  celebrate(transfer_request_region_physicians_validation),
  transfer_request_region_physicians
);
router.post(
  "/dashboard/requests/:confirmation_no/actions/transferrequest",
  authmiddleware,
  celebrate(transfer_request_validation),
  transfer_request
);

/**
 * @description Given below are Express routes that allows clearing case/request.
 */
router.delete(
  "/dashboard/requests/:confirmation_no/actions/clearcase",
  authmiddleware,
  celebrate(clear_case_for_request_validation),
  clear_case_for_request
);

/**
 * @description This function handles sending and updating agreements for a request.
 */
router.post(
  "/dashboard/requests/:confirmation_no/actions/sendagreement",
  authmiddleware,
  celebrate(send_agreement_validation),
  send_agreement
);
router.put(
  "/dashboard/requests/:confirmation_no/actions/updateagreement",
  authmiddleware,
  celebrate(update_agreement_validation),
  update_agreement
);

/**
 * @description These handles various actions related to closing a case for a request, including viewing details, editing patient data, and downloading documents.
 */
router.get(
  "/dashboard/requests/:confirmation_no/actions/closecase/viewdetails",
  authmiddleware,
  celebrate(close_case_for_request_validation),
  close_case_for_request_view_details
);
router.put(
  "/dashboard/requests/:confirmation_no/actions/closecase",
  authmiddleware,
  celebrate(close_case_for_request_view_details_validation),
  close_case_for_request
);
router.post(
  "/dashboard/requests/:confirmation_no/actions/closecase/edit",
  authmiddleware,
  celebrate(close_case_for_request_edit_validation),
  close_case_for_request_edit
);
router.get(
  "/dashboard/requests/:confirmation_no/actions/closecase/actions/download/:document_id",
  authmiddleware,
  celebrate(close_case_for_request_actions_download_validation),
  close_case_for_request_actions_download
);

/**Admin Request Support */
/**
 * @description Given below are Express routes that allows request support.
 */
router.put(
  "/dashboard/requests/requestsupport",
  authmiddleware,
  celebrate(request_support_validation),
  request_support
);

/**Admin Send Link */
/**
 * @description Given below are Express routes that allows sending link to create a request.
 */
router.post(
  "/dashboard/requests/sendlink",
  celebrate(admin_send_link_validation),
  authmiddleware,
  admin_send_link
);

/** Total 1 API's as given below */
/** View Uploads * 1 is not refactored */

export default router;
