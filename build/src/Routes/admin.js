"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Controllers_1 = require("../Controllers");
const Controllers_2 = require("../Controllers");
const Middlewares_1 = require("../Middlewares");
const router = express_1.default.Router();
router.get("/dashboard/requests/:state", Middlewares_1.adminauthmiddleware, (req, res, next) => {
    (0, Controllers_1.getRequestsByState)(req, res, next);
});
router.get("/dashboard/requests/:state/:requestId/requestsbyregion", Middlewares_1.adminauthmiddleware, (req, res, next) => {
    (0, Controllers_2.getRequestsByRegion)(req, res, next);
});
router.get("/dashboard/requests/:state/:requestId/actions/viewcase", Middlewares_1.adminauthmiddleware, (req, res, next) => {
    (0, Controllers_2.getViewCaseForRequest)(req, res, next);
});
router.delete("/dashboard/requests/:state/:requestId/actions/clearcase", Middlewares_1.adminauthmiddleware, (req, res, next) => {
    (0, Controllers_2.deleteClearCaseForRequest)(req, res, next);
});
router.put("/dashboard/requests/:state/:requestId/actions/blockcase", Middlewares_1.adminauthmiddleware, (req, res, next) => {
    (0, Controllers_2.putBlockCaseForRequest)(req, res, next);
});
router.put("/dashboard/requests/:state/:requestId/actions/cancelcase", Middlewares_1.adminauthmiddleware, (req, res, next) => {
    (0, Controllers_2.putCancelCaseForRequest)(req, res, next);
});
router.put("/dashboard/requests/:state/:requestId/actions/closecase", Middlewares_1.adminauthmiddleware, (req, res, next) => {
    (0, Controllers_2.putCloseCaseForRequest)(req, res, next);
});
router.get("/dashboard/requests/:state/:requestId/actions/viewnotes", Middlewares_1.adminauthmiddleware, (req, res, next) => {
    (0, Controllers_2.getViewNotesForRequest)(req, res, next);
});
router.post("/dashboard/requests/:state/:requestId/actions/sendorders", Middlewares_1.adminauthmiddleware, (req, res, next) => {
    (0, Controllers_2.postSendOrdersForRequest)(req, res, next);
});
router.post("/dashboard/requests/:state/:requestId/actions/transferrequest", Middlewares_1.adminauthmiddleware, (req, res, next) => {
    (0, Controllers_2.postTransferRequest)(req, res, next);
});
router.post("/dashboard/requests/:state/:requestId/actions/sendagreement", Middlewares_1.adminauthmiddleware, (req, res, next) => {
    (0, Controllers_2.postSendAgreement)(req, res, next);
});
router.put("/dashboard/requests/:state/:requestId/actions/assignrequest", Middlewares_1.adminauthmiddleware, (req, res, next) => {
    (0, Controllers_2.putAssignRequest)(req, res, next);
});
router.post("/dashboard/requests/:state/requestsupport", Middlewares_1.adminauthmiddleware, (req, res, next) => {
    (0, Controllers_2.postRequestSupport)(req, res, next);
});
exports.default = router;
