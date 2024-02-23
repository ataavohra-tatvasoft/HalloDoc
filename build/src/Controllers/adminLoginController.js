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
exports.adminLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const statusCodes_1 = __importDefault(require("../public/statusCodes"));
const admin_1 = __importDefault(require("../Models/admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body: { email, password }, } = req;
        var adminData;
        const hash = yield admin_1.default.findOne({
            where: {
                email,
            },
        });
        if (!hash) {
            return res.status(404).json({
                status: false,
                message: "USER " + statusCodes_1.default[404],
            });
        }
        const hashpassword = hash.password;
        const boolean = yield bcrypt_1.default.compare(password, hashpassword);
        if (boolean) {
            adminData = yield admin_1.default.findOne({
                where: {
                    email,
                    password: hashpassword,
                },
            });
        }
        if (!adminData) {
            return res.status(401).json({
                status: false,
                message: statusCodes_1.default[401],
            });
        }
        const data = {
            email: email,
            password: password,
        };
        const jwtToken = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET_KEY);
        return res.status(200).json({
            status: true,
            message: statusCodes_1.default[200],
            jwtToken,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            errormessage: error.message,
            message: statusCodes_1.default[500],
        });
    }
});
exports.adminLogin = adminLogin;
