"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.post("/dashboard/requests/createrequest", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.create_request)(req, res, next);
});
router.get("/dashboard/requests/:state", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.requests_by_request_state)(req, res, next);
});
router.get("/dashboard/requests/:state/:region/requestsbyregion", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.requests_by_region)(req, res, next);
});
router.put("/dashboard/requests/requestsupport", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.request_support)(req, res, next);
});
router.get("/dashboard/requests/:admin_id/admin_profile", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.admin_profile)(req, res, next);
});
router.get("/dashboard/requests/:state/:confirmation_no/actions/viewcase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.view_case_for_request)(req, res, next);
});
router.delete("/dashboard/requests/:state/:confirmation_no/actions/clearcase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.clear_case_for_request)(req, res, next);
});
router.put("/dashboard/requests/:state/:confirmation_no/actions/blockcase", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.block_case_for_request)(req, res, next);
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
router.post("/dashboard/requests/:state/:confirmation_no/actions/viewnotes/", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.save_view_notes_for_request)(req, res, next);
});
router.post("/dashboard/requests/:state/:confirmation_no/actions/sendorders", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.send_orders_for_request)(req, res, next);
});
router.get("/dashboard/requests/:state/:confirmation_no/actions/transferrequestregion/:region", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.transfer_request_region)(req, res, next);
});
router.post("/dashboard/requests/:state/:confirmation_no/actions/transferrequest", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.transfer_request)(req, res, next);
});
router.post("/dashboard/requests/:state/:confirmation_no/actions/sendagreement", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.send_agreement)(req, res, next);
});
router.get("/dashboard/requests/:state/:confirmation_no/actions/assignrequest/:region", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.assign_request_region)(req, res, next);
});
router.put("/dashboard/requests/:state/:confirmation_no/actions/assignrequest", middlewares_1.authmiddleware, (req, res, next) => {
    (0, controllers_1.assign_request)(req, res, next);
});
exports.default = router;
