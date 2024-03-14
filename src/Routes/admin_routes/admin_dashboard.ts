import express, { Router } from "express";
import {
  admin_create_request,
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
  transfer_request_regions,
  transfer_request_region_physicians,
  view_uploads_download_all,
  admin_send_link,
  requests_by_request_state_refactored,
  requests_by_request_state_counts,
  region_for_request_states
} from "../../controllers";
import { authmiddleware } from "../../middlewares";
import multer, { diskStorage } from "multer";
import path from "path";
import {requests_by_request_state_validation,
  cancel_case_validation

} from "../../middlewares/index";

const router: Router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "..") + "\\src\\public\\uploads"); // Adjust as needed
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-";
    const ext = path.extname(file.originalname); // Extract extension
    cb(null, uniqueSuffix + ext);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ["image/png", "image/jpg", "image/jpeg"];
    const extname = file.mimetype.toLowerCase();
    if (allowedExtensions.includes(extname)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PNG, JPG, and JPEG files are allowed."
        )
      );
    }
  },
});

/**                              Admin in Dashboard                                       */
/**Admin Create Request */
router.post(
  "/dashboard/requests/createrequest",
  authmiddleware,
  admin_create_request
);
router.get(
  "/dashboard/requests/regions",
  authmiddleware,
  region_with_thirdparty_API
);
// router.get("/dashboard/requests", authmiddleware, requests_by_request_state);
router.get(
  "/dashboard/requestsregion",
  authmiddleware,
  region_for_request_states
);
router.get(
  "/dashboard/requestscount",
  authmiddleware,
  requests_by_request_state_counts
);
router.get(
  "/dashboard/requests",
  authmiddleware,
  requests_by_request_state_validation,
  requests_by_request_state_refactored
);

/**Admin Request Actions */
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewcase",
  authmiddleware,
  view_case_for_request
);
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewnotes",
  authmiddleware,
  view_notes_for_request
);
router.put(
  "/dashboard/requests/:confirmation_no/actions/viewnotes",
  authmiddleware,
  save_view_notes_for_request
);
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewcancelcase",
  authmiddleware,
  cancel_case_for_request_view_data
);
router.put(
  "/dashboard/requests/:confirmation_no/actions/cancelcase",
  authmiddleware,
  cancel_case_validation,
  cancel_case_for_request
);
router.get(
  "/dashboard/requests/:confirmation_no/actions/assignrequestphysicians",
  authmiddleware,
  assign_request_region_physician
);
router.put(
  "/dashboard/requests/:confirmation_no/actions/assignrequest",
  authmiddleware,
  assign_request
);
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewblockcase",
  authmiddleware,
  block_case_for_request_view
);
router.put(
  "/dashboard/requests/:confirmation_no/actions/blockcase",
  authmiddleware,
  block_case_for_request
);
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewuploads/viewdata",
  authmiddleware,
  view_uploads_view_data
);
router.post(
  "/dashboard/requests/:confirmation_no/actions/viewuploads/upload",
  authmiddleware,
  upload.single("file"),
  view_uploads_upload
);
router.delete(
  "/dashboard/requests/:confirmation_no/actions/viewuploads/delete/:document_id",
  authmiddleware,
  view_uploads_actions_delete
);
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewuploads/download/:document_id",
  authmiddleware,
  view_uploads_actions_download
);
router.delete(
  "/dashboard/requests/:confirmation_no/actions/viewuploads/deleteall",
  authmiddleware,
  view_uploads_delete_all
);
router.get(
  "/dashboard/requests/:confirmation_no/actions/viewuploads/downloadall",
  authmiddleware,
  view_uploads_download_all
);
router.get(
  "/dashboard/requests/actions/sendorders/professions",
  authmiddleware,
  professions_for_send_orders
);
router.get(
  "/dashboard/requests/actions/sendorders/businesses",
  authmiddleware,
  business_name_for_send_orders
);
router.get(
  "/dashboard/requests/actions/viewsendorders",
  authmiddleware,
  view_send_orders_for_request
);
router.post(
  "/dashboard/requests/:state/:confirmation_no/actions/sendorders",
  authmiddleware,
  send_orders_for_request
);
router.get(
  "/dashboard/requests/actions/transferrequestregions",
  authmiddleware,
  transfer_request_regions
);
router.get(
  "/dashboard/requests/actions/transferrequestphysicians",
  authmiddleware,
  transfer_request_region_physicians
);
router.post(
  "/dashboard/requests/:confirmation_no/actions/transferrequest",
  authmiddleware,
  transfer_request
);
router.delete(
  "/dashboard/requests/:confirmation_no/actions/clearcase",
  authmiddleware,
  clear_case_for_request
);
router.post(
  "/dashboard/requests/:confirmation_no/actions/sendagreement",
  authmiddleware,
  send_agreement
);
router.post(
  "/dashboard/requests/:confirmation_no/actions/updateagreement",
  authmiddleware,
  update_agreement
);
router.get(
  "/dashboard/requests/:confirmation_no/actions/closecase/viewdetails",
  authmiddleware,
  close_case_for_request_view_details
);
router.put(
  "/dashboard/requests/:confirmation_no/actions/closecase",
  authmiddleware,
  close_case_for_request
);
router.post(
  "/dashboard/requests/:confirmation_no/actions/closecase/edit",
  authmiddleware,
  close_case_for_request_edit
);
router.get(
  "/dashboard/requests/:confirmation_no/actions/closecase/actions/download/:document_id",
  authmiddleware,
  close_case_for_request_actions_download
);

/**Admin Request Support */
router.put(
  "/dashboard/requests/requestsupport",
  authmiddleware,
  request_support
);

/**Admin Send Link */
router.post("/dashboard/requests/sendlink", authmiddleware, admin_send_link);

/** Total 1 API's as given below */
/** View Uploads * 1 is not refactored */

export default router;
