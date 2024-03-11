"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
/**                              Admin in Dashboard                                       */
/**Admin Create Request */
router.post("/dashboard/requests/createrequest", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.admin_create_request)(req, res, next);
});
router.get("/dashboard/requests/region", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.region_without_thirdparty_API)(req, res, next);
});
router.get("/dashboard/requests/regions", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.region_with_thirdparty_API)(req, res, next);
});
router.get("/dashboard/requests", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.requests_by_request_state)(req, res, next);
});
/**Admin Request Actions */
router.get("/dashboard/requests/:confirmation_no/actions/viewcase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.view_case_for_request)(req, res, next);
});
router.get("/dashboard/requests/:confirmation_no/actions/viewnotes", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.view_notes_for_request)(req, res, next);
});
router.post("/dashboard/requests/:confirmation_no/actions/viewnotes", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.save_view_notes_for_request)(req, res, next);
});
router.get("/dashboard/requests/:confirmation_no/actions/viewcancelcase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.cancel_case_for_request_view_data)(req, res, next);
});
router.put("/dashboard/requests/:confirmation_no/actions/cancelcase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.cancel_case_for_request)(req, res, next);
});
router.get("/dashboard/requests/actions/assignrequestphysicians", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.assign_request_region_physician)(req, res, next);
});
router.put("/dashboard/requests/:confirmation_no/actions/assignrequest", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.assign_request)(req, res, next);
});
router.get("/dashboard/requests/:confirmation_no/actions/viewblockcase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.block_case_for_request_view)(req, res, next);
});
router.put("/dashboard/requests/:confirmation_no/actions/blockcase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.block_case_for_request)(req, res, next);
});
router.get("/dashboard/requests/:state/:confirmation_no/actions/viewuploads/viewdata", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.view_uploads_view_data)(req, res, next);
});
router.post("/dashboard/requests/:state/:confirmation_no/actions/viewuploads/upload", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.view_uploads_upload)(req, res, next);
});
router.delete("/dashboard/requests/:state/:confirmation_no/actions/viewuploads/delete", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.view_uploads_actions_delete)(req, res, next);
});
router.get("/dashboard/requests/:state/:confirmation_no/actions/viewuploads/download/:document_id", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.view_uploads_actions_download)(req, res, next);
});
router.delete("/dashboard/requests/:state/:confirmation_no/actions/viewuploads/deleteall", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.view_uploads_delete_all)(req, res, next);
});
router.get("/dashboard/requests/actions/sendorders/professions", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.professions_for_send_orders)(req, res, next);
});
router.post("/dashboard/requests/:state/:confirmation_no/actions/sendorders", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.send_orders_for_request)(req, res, next);
});
router.get("/dashboard/requests/actions/transferrequestphysicians", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.transfer_request_region_physicians)(req, res, next);
});
router.post("/dashboard/requests/:confirmation_no/actions/transferrequest", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.transfer_request)(req, res, next);
});
router.delete("/dashboard/requests/:confirmation_no/actions/clearcase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.clear_case_for_request)(req, res, next);
});
router.post("/dashboard/requests/:confirmation_no/actions/sendagreement", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.send_agreement)(req, res, next);
});
router.post("/dashboard/requests/:confirmation_no/actions/updateagreement", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.update_agreement)(req, res, next);
});
router.get("/dashboard/requests/:confirmation_no/actions/closecase/viewdetails", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.close_case_for_request_view_details)(req, res, next);
});
router.put("/dashboard/requests/:confirmation_no/actions/closecase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.close_case_for_request)(req, res, next);
});
router.post("/dashboard/requests/:confirmation_no/actions/closecase/edit", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.close_case_for_request_edit)(req, res, next);
});
router.get("/dashboard/requests/:confirmation_no/actions/closecase/actions/download/:document_id", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.close_case_for_request_actions_download)(req, res, next);
});
/** Total 6 API's as given below */
/** View Uploads * 4, send_link and close_case->action->download are not giving proper outputs */
/**Admin Request Support */
router.put("/dashboard/requests/requestsupport", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.request_support)(req, res, next);
});
/**Admin Profile */
router.get("/dashboard/requests/admin_profile/view", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.admin_profile_view)(req, res, next);
});
router.put("/dashboard/requests/admin_profile/resetpassword", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.admin_profile_reset_password)(req, res, next);
});
router.post("/dashboard/requests/admin_profile/editadmininfo", middlewares_1.authmiddleware, middlewares_1.admin_profile_info_edit_middleware, (req, res, next) => {
    (0, controllers_1.admin_profile_admin_info_edit)(req, res, next);
});
router.post("/dashboard/requests/admin_profile/editbillingfinfo", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.admin_profile_mailing_billling_info_edit)(req, res, next);
});
/**                             Admin in Access Roles                                     */
/** Admin Account Access */
router.get("/access/accountaccess", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.access_accountaccess)(req, res, next);
});
router.get("/access/accountaccess/:account_id/edit", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.access_accountaccess_edit)(req, res, next);
});
router.put("/access/accountaccess/:account_id/edit/save", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.access_accountaccess_edit_save)(req, res, next);
});
router.delete("/access/accountaccess/:account_id/delete", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.access_accountaccess_delete)(req, res, next);
});
/** Admin User Access */
router.get("/access/useraccess", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.access_useraccess)(req, res, next);
});
router.get("/access/useraccess/:account_id/edit", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.access_useraccess_edit)(req, res, next);
});
router.put("/access/useraccess/:account_id/edit/save", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.access_useraccess_edit_save)(req, res, next);
});
/**                             Admin in Provider Menu                                    */
exports.default = router;
