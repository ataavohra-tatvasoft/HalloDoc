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
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const status_codes_1 = __importDefault(require("../../public/status_codes"));
const admin_1 = __importDefault(require("../../db/models/admin"));
const provider_1 = __importDefault(require("../../db/models/provider"));
const dotenv_1 = __importDefault(require("dotenv"));
const patient_1 = __importDefault(require("../../db/models/patient"));
dotenv_1.default.config();
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var admin_data;
        var provider_data;
        const { body: { email, password }, } = req;
        const admin_hash = yield admin_1.default.findOne({
            where: {
                email,
            },
        });
        const provider_hash = yield provider_1.default.findOne({
            where: {
                email,
            },
        });
        if (!admin_hash && !provider_hash) {
            return res.status(404).json({
                status: false,
                message: "USER " + status_codes_1.default[404],
            });
        }
        if (admin_hash) {
            const hashpassword = admin_hash.password;
            const admin_boolean = yield bcrypt_1.default.compare(password, hashpassword);
            if (admin_boolean) {
                admin_data = yield admin_1.default.findOne({
                    where: {
                        email,
                        password: hashpassword,
                    },
                });
            }
            if (!admin_data) {
                return res.status(401).json({
                    status: false,
                    message: status_codes_1.default[401],
                });
            }
        }
        if (provider_hash) {
            const hashpassword = provider_hash.password;
            const provider_boolean = yield bcrypt_1.default.compare(password, hashpassword);
            if (provider_boolean) {
                provider_data = yield patient_1.default.findOne({
                    where: {
                        email,
                        password: hashpassword,
                    },
                });
            }
            if (!provider_data) {
                return res.status(401).json({
                    status: false,
                    message: status_codes_1.default[401],
                });
            }
        }
        const data = {
            email: email,
            password: password,
        };
        const jwtToken = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET_KEY);
        return res.status(200).json({
            status: true,
            message: status_codes_1.default[200],
            jwtToken,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            errormessage: error.message,
            message: status_codes_1.default[500],
        });
    }
});
exports.login = login;
