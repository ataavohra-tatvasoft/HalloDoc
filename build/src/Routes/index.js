"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_1 = __importDefault(require("./login"));
const signup_1 = __importDefault(require("./signup"));
const forgotResetPassword_1 = __importDefault(require("./forgotResetPassword"));
const adminschema_1 = require("../Middlewares/adminschema");
const router = express_1.default.Router();
router.use("/login", login_1.default);
router.use("/signup", adminschema_1.adminSchemaSignUp, signup_1.default);
router.use("/forgotresetpassword", forgotResetPassword_1.default);
exports.default = router;
