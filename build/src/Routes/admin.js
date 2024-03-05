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
/**Admin request by request_state and region */
// router.get(
//   "/dashboard/requests/:state",
//   authmiddleware,
//   (req: Request, res: Response, next: NextFunction) => {
//     requests_by_request_state_regions(req, res, next);
//   }
// );
router.get("/dashboard/requests/:state/:region", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.requests_by_request_state)(req, res, next);
});
/**Admin Request Support */
router.put("/dashboard/requests/requestsupport", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.request_support)(req, res, next);
});
/**Admin Profile */
router.get("/dashboard/requests/admin_profile", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.admin_profile)(req, res, next);
});
/**Admin Request Actions */
router.get("/dashboard/requests/:state/:confirmation_no/actions/viewcase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.view_case_for_request)(req, res, next);
});
router.delete("/dashboard/requests/:state/:confirmation_no/actions/clearcase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.clear_case_for_request)(req, res, next);
});
router.put("/dashboard/requests/:state/:confirmation_no/actions/blockcase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.block_case_for_request)(req, res, next);
});
router.get("/dashboard/requests/:state/:confirmation_no/actions/cancelcaseview", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.cancel_case_for_request_view)(req, res, next);
});
router.put("/dashboard/requests/:state/:confirmation_no/actions/cancelcase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.cancel_case_for_request)(req, res, next);
});
router.put("/dashboard/requests/:state/:confirmation_no/actions/closecase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.close_case_for_request)(req, res, next);
});
router.put("/dashboard/requests/:state/:confirmation_no/actions/closecase_edit", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.close_case_for_request_edit)(req, res, next);
});
router.get("/dashboard/requests/:state/:confirmation_no/actions/viewnotes/:notes_for", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.view_notes_for_request)(req, res, next);
});
router.post("/dashboard/requests/:state/:confirmation_no/actions/viewnotes", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.save_view_notes_for_request)(req, res, next);
});
router.post("/dashboard/requests/:state/:confirmation_no/actions/sendorders", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.send_orders_for_request)(req, res, next);
});
router.get("/dashboard/requests/:state/:confirmation_no/actions/transferrequestregions", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.transfer_request_regions)(req, res, next);
});
router.get("/dashboard/requests/:state/:confirmation_no/actions/transferrequestregionphysician/:region", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.transfer_request_region_physician)(req, res, next);
});
router.post("/dashboard/requests/:state/:confirmation_no/actions/transferrequest", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.transfer_request)(req, res, next);
});
router.post("/dashboard/requests/:state/:confirmation_no/actions/sendagreement", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.send_agreement)(req, res, next);
});
// router.get(
//   "/dashboard/requests/:state/:confirmation_no/actions/assignrequestregion",
//   authmiddleware,
//   (req: Request, res: Response, next: NextFunction) => {
//     assign_request_regions(req, res, next);
//   }
// );
router.get("/dashboard/requests/:state/:confirmation_no/actions/assignrequestregionphysician/:region", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.assign_request_region_physician)(req, res, next);
});
router.put("/dashboard/requests/:state/:confirmation_no/actions/assignrequest", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.assign_request)(req, res, next);
});
/** Clear case and admin profile are not giving proper outputs */
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
