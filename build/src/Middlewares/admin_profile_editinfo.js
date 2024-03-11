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
exports.admin_profile_info_edit_middleware = void 0;
const joi_1 = __importDefault(require("joi"));
const status_codes_1 = __importDefault(require("../public/status_codes"));
const admin_profile_info_edit_middleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { email, confirm_email }, } = req;
    const adminSchema = joi_1.default.object({
        Email: joi_1.default.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com"] },
        }),
        Confirm_Email: joi_1.default.ref("Email")
    });
    try {
        yield adminSchema.validateAsync({
            Email: email,
            Confirm_Email: confirm_email
        }, { abortEarly: false, presence: "required" });
        next();
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            errormessage: error.message,
            message: status_codes_1.default[500],
        });
    }
});
exports.admin_profile_info_edit_middleware = admin_profile_info_edit_middleware;
