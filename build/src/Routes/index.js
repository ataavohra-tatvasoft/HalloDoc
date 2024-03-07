"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_recover_1 = __importDefault(require("./login_recover"));
const signup_1 = __importDefault(require("./signup"));
const admin_1 = __importDefault(require("./admin"));
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.use("/login", login_recover_1.default);
router.use("/signup", signup_1.default);
router.use("/recoverpassword", login_recover_1.default);
router.use("/admin", middlewares_1.authmiddleware, admin_1.default);
exports.default = router;
