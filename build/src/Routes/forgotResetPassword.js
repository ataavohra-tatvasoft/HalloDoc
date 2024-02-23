"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Controllers_1 = require("../Controllers");
const router = express_1.default.Router();
router.post("/forgotpassword", (req, res, next) => {
    (0, Controllers_1.forgotPassword)(req, res, next);
});
router.post("/resetpassword", (req, res, next) => {
    (0, Controllers_1.resetPassword)(req, res, next);
});
exports.default = router;
