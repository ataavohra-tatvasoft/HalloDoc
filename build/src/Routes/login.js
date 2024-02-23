"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminLoginController_1 = require("../Controllers/adminLoginController");
const router = express_1.default.Router();
router.post('/adminLogin', (req, res, next) => {
    (0, adminLoginController_1.adminLogin)(req, res, next);
});
exports.default = router;
