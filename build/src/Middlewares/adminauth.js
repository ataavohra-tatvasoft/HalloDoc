"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminauthmiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_1 = __importDefault(require("../Models/admin"));
const statusCodes_1 = __importDefault(require("../public/statusCodes"));
// import { error } from 'console';
// import { stat } from 'fs';
const adminauthmiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    try {
        if (!authorization) {
            return res.status(401).json({ error: "Not authorized" });
        }
        const token = authorization.split(" ")[1];
        const verifiedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const validUser = yield admin_1.default.findOne({
            where: {
                email: verifiedToken.email,
            },
        });
        if (validUser) {
            req.email = verifiedToken.email;
            next();
        }
        else {
            return res.status(400).json({
                status: false,
                message: "Invalid user",
                error: statusCodes_1.default[400],
            });
        }
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token", errormessage: statusCodes_1.default[401] });
        }
        else {
            return res.status(500).json({ message: "Server error", errormessage: statusCodes_1.default[500] });
        }
    }
});
exports.adminauthmiddleware = adminauthmiddleware;
exports.default = exports.adminauthmiddleware;
