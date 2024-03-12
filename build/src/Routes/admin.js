"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, "..", "..", "..") + "\\src\\public\\uploads"); // Adjust as needed
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-";
        const ext = path_1.default.extname(file.originalname); // Extract extension
        cb(null, uniqueSuffix + ext);
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ["image/png", "image/jpg", "image/jpeg"];
        const extname = file.mimetype.toLowerCase();
        if (allowedExtensions.includes(extname)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Only PNG, JPG, and JPEG files are allowed."));
        }
    },
});
/**                              Admin in Dashboard                                       */
/**Admin Create Request */
router.post("/dashboard/requests/createrequest", middlewares_1.authmiddleware, controllers_1.admin_create_request);
router.get("/dashboard/requests/region", middlewares_1.authmiddleware, controllers_1.region_without_thirdparty_API);
router.get("/dashboard/requests/regions", middlewares_1.authmiddleware, controllers_1.region_with_thirdparty_API);
router.get("/dashboard/requests", middlewares_1.authmiddleware, controllers_1.requests_by_request_state);
/**Admin Request Actions */
router.get("/dashboard/requests/:confirmation_no/actions/viewcase", middlewares_1.authmiddleware, controllers_1.view_case_for_request);
router.get("/dashboard/requests/:confirmation_no/actions/viewnotes", middlewares_1.authmiddleware, controllers_1.view_notes_for_request);
router.post("/dashboard/requests/:confirmation_no/actions/viewnotes", middlewares_1.authmiddleware, controllers_1.save_view_notes_for_request);
router.get("/dashboard/requests/:confirmation_no/actions/viewcancelcase", middlewares_1.authmiddleware, controllers_1.cancel_case_for_request_view_data);
router.put("/dashboard/requests/:confirmation_no/actions/cancelcase", middlewares_1.authmiddleware, controllers_1.cancel_case_for_request);
router.get("/dashboard/requests/actions/assignrequestphysicians", middlewares_1.authmiddleware, controllers_1.assign_request_region_physician);
router.put("/dashboard/requests/:confirmation_no/actions/assignrequest", middlewares_1.authmiddleware, controllers_1.assign_request);
router.get("/dashboard/requests/:confirmation_no/actions/viewblockcase", middlewares_1.authmiddleware, controllers_1.block_case_for_request_view);
router.put("/dashboard/requests/:confirmation_no/actions/blockcase", middlewares_1.authmiddleware, controllers_1.block_case_for_request);
router.get("/dashboard/requests/:confirmation_no/actions/viewuploads/viewdata", middlewares_1.authmiddleware, controllers_1.view_uploads_view_data);
router.post("/dashboard/requests/:confirmation_no/actions/viewuploads/upload", middlewares_1.authmiddleware, upload.single("file"), controllers_1.view_uploads_upload);
router.delete("/dashboard/requests/:confirmation_no/actions/viewuploads/delete/:document_id", middlewares_1.authmiddleware, controllers_1.view_uploads_actions_delete);
router.get("/dashboard/requests/:confirmation_no/actions/viewuploads/download/:document_id", middlewares_1.authmiddleware, controllers_1.view_uploads_actions_download);
router.delete("/dashboard/requests/:confirmation_no/actions/viewuploads/deleteall", middlewares_1.authmiddleware, controllers_1.view_uploads_delete_all);
router.get("/dashboard/requests/:confirmation_no/actions/viewuploads/downloadall", middlewares_1.authmiddleware, controllers_1.view_uploads_download_all);
router.get("/dashboard/requests/actions/sendorders/professions", middlewares_1.authmiddleware, controllers_1.professions_for_send_orders);
router.post("/dashboard/requests/:state/:confirmation_no/actions/sendorders", middlewares_1.authmiddleware, controllers_1.send_orders_for_request);
router.get("/dashboard/requests/actions/transferrequestphysicians", middlewares_1.authmiddleware, controllers_1.transfer_request_region_physicians);
router.post("/dashboard/requests/:confirmation_no/actions/transferrequest", middlewares_1.authmiddleware, controllers_1.transfer_request);
router.delete("/dashboard/requests/:confirmation_no/actions/clearcase", middlewares_1.authmiddleware, controllers_1.clear_case_for_request);
router.post("/dashboard/requests/:confirmation_no/actions/sendagreement", middlewares_1.authmiddleware, controllers_1.send_agreement);
router.post("/dashboard/requests/:confirmation_no/actions/updateagreement", middlewares_1.authmiddleware, controllers_1.update_agreement);
router.get("/dashboard/requests/:confirmation_no/actions/closecase/viewdetails", middlewares_1.authmiddleware, controllers_1.close_case_for_request_view_details);
router.put("/dashboard/requests/:confirmation_no/actions/closecase", middlewares_1.authmiddleware, controllers_1.close_case_for_request);
router.post("/dashboard/requests/:confirmation_no/actions/closecase/edit", middlewares_1.authmiddleware, controllers_1.close_case_for_request_edit);
router.get("/dashboard/requests/:confirmation_no/actions/closecase/actions/download/:document_id", middlewares_1.authmiddleware, controllers_1.close_case_for_request_actions_download);
/**Admin Request Support */
router.put("/dashboard/requests/requestsupport", middlewares_1.authmiddleware, controllers_1.request_support);
/**Admin Send Link */
router.post("/dashboard/requests/sendlink", middlewares_1.authmiddleware, controllers_1.admin_send_link);
/** Total 2 API's as given below */
/** View Uploads * 1 and send_link are not refactored */
/**Admin in My Profile */
router.get("/myprofile/admin_profile/view", middlewares_1.authmiddleware, controllers_1.admin_profile_view);
router.put("/myprofile/admin_profile/resetpassword", middlewares_1.authmiddleware, controllers_1.admin_profile_reset_password);
router.post("/myprofile/admin_profile/editadmininfo", middlewares_1.authmiddleware, middlewares_1.admin_profile_info_edit_middleware, controllers_1.admin_profile_admin_info_edit);
router.post("/myprofile/admin_profile/editbillingfinfo", middlewares_1.authmiddleware, controllers_1.admin_profile_mailing_billling_info_edit);
/**                             Admin in Access Roles                                     */
/** Admin Account Access */
router.get("/access/accountaccess", middlewares_1.authmiddleware, controllers_1.access_accountaccess);
router.get("/access/accountaccess/:account_id/edit", middlewares_1.authmiddleware, controllers_1.access_accountaccess_edit);
router.put("/access/accountaccess/:account_id/edit/save", middlewares_1.authmiddleware, controllers_1.access_accountaccess_edit_save);
router.delete("/access/accountaccess/:account_id/delete", middlewares_1.authmiddleware, controllers_1.access_accountaccess_delete);
/** Admin User Access */
router.get("/access/useraccess", middlewares_1.authmiddleware, controllers_1.access_useraccess);
router.get("/access/useraccess/:account_id/edit", middlewares_1.authmiddleware, controllers_1.access_useraccess_edit);
router.put("/access/useraccess/:account_id/edit/save", middlewares_1.authmiddleware, controllers_1.access_useraccess_edit_save);
/**                             Admin in Provider Menu                                    */
exports.default = router;
