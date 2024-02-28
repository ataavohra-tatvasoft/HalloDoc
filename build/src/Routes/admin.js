"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.get("/dashboard/requests/:state", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.requests_by_state)(req, res, next);
});
router.get("/dashboard/requests/:state/:requestId/requestsbyregion", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.requests_by_region)(req, res, next);
});
router.get("/dashboard/requests/:state/:requestId/actions/viewcase", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.view_case_for_request)(req, res, next);
});
router.delete("/dashboard/requests/:state/:requestId/actions/clearcase", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.clear_case_for_request)(req, res, next);
});
router.put("/dashboard/requests/:state/:requestId/actions/blockcase", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.block_case_for_request)(req, res, next);
});
router.put("/dashboard/requests/:state/:requestId/actions/cancelcase", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.cancel_case_for_request)(req, res, next);
});
router.put("/dashboard/requests/:state/:requestId/actions/closecase", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.close_case_for_request)(req, res, next);
});
router.get("/dashboard/requests/:state/:requestId/actions/viewnotes", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.view_notes_for_request)(req, res, next);
});
router.post("/dashboard/requests/:state/:requestId/actions/sendorders", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.send_orders_for_request)(req, res, next);
});
router.post("/dashboard/requests/:state/:requestId/actions/transferrequest", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.transfer_request)(req, res, next);
});
router.post("/dashboard/requests/:state/:requestId/actions/sendagreement", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.send_agreement)(req, res, next);
});
router.get("/dashboard/requests/:state/:requestId/actions/assignrequest/:region", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.assign_request_region)(req, res, next);
});
router.put("/dashboard/requests/:state/:requestId/actions/assignrequest", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.assign_request)(req, res, next);
});
router.post("/dashboard/requests/:state/requestsupport", middlewares_1.admin_authmiddleware, (req, res, next) => {
    (0, controllers_1.request_support)(req, res, next);
});
exports.default = router;
