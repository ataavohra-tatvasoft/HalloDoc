"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.post("/admin_provider_login", (req, res, next) => {
    (0, controllers_1.login)(req, res, next);
});
router.post("/patientlogin", (req, res, next) => {
    (0, controllers_1.patient_login)(req, res, next);
});
router.post("/admin_provider/forgotpassword", (req, res, next) => {
    (0, controllers_1.forgot_password)(req, res, next);
});
router.post("/admin_provider/resetpassword", (req, res, next) => {
    (0, controllers_1.reset_password)(req, res, next);
});
router.post("/patient/forgotpassword", (req, res, next) => {
    (0, controllers_1.patient_forgot_password)(req, res, next);
});
router.post("/patient/resetpassword", (req, res, next) => {
    (0, controllers_1.patient_reset_password)(req, res, next);
});
exports.default = router;
