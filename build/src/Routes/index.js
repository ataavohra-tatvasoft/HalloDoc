"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_1 = __importDefault(require("./login"));
const signup_1 = __importDefault(require("./signup"));
const recoverPassword_1 = __importDefault(require("./recoverPassword"));
const Middlewares_1 = require("../Middlewares");
const admin_1 = __importDefault(require("./admin"));
const Middlewares_2 = require("../Middlewares");
const router = express_1.default.Router();
router.use("/login", login_1.default);
router.use("/signup", Middlewares_1.adminSchemaSignUp, signup_1.default);
router.use("/recoverpassword", recoverPassword_1.default);
router.use('/admin', Middlewares_2.adminauthmiddleware, admin_1.default);
exports.default = router;
