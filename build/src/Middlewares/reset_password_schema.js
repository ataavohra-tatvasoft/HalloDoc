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
exports.reset_password_schema = void 0;
const joi_1 = __importDefault(require("joi"));
const status_codes_1 = __importDefault(require("../public/status_codes"));
const reset_password_schema = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { password, confirm_password }, } = req;
    const schema = joi_1.default.object({
        Password: joi_1.default.string()
            .min(5)
            .required()
            .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=?{|}\[\]:\'\";,.<>\/\\|\s]).+$/),
        Confirm_Password: joi_1.default.ref("Password"),
    });
    try {
        yield schema.validateAsync({
            Password: password,
            Confirm_Password: confirm_password,
        }, { abortEarly: false });
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
exports.reset_password_schema = reset_password_schema;
