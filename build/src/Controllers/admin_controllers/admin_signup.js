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
exports.admin_signup = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const admin_1 = __importDefault(require("../../db/models/admin"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const status_codes_1 = __importDefault(require("../../public/status_codes"));
dotenv_1.default.config({ path: `.env` });
const admin_signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { Email, Confirm_Email, Password, Confirm_Password, Status, Role, FirstName, LastName, MobileNumber, Zip, Billing_MobileNumber, Address_1, Address_2, City, State, Country_Code, }, } = req;
    const hashedPassword = yield bcrypt_1.default.hash(Password, 10);
    try {
        const adminData = yield admin_1.default.create({
            email: Email,
            password: hashedPassword,
            status: Status,
            role: Role,
            firstname: FirstName,
            lastname: LastName,
            mobile_no: MobileNumber,
            zip: Zip,
            billing_mobile_no: Billing_MobileNumber,
            address_1: Address_1,
            address_2: Address_2,
            city: City,
            state: State,
            country_code: Country_Code,
        });
        if (!adminData) {
            return res.status(400).json({
                status: false,
                message: "Failed To SignUp!!!",
            });
        }
        if (adminData) {
            return res.status(200).json({
                status: true,
                message: "SignedUp Successfully !!!",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            status: false,
            errormessage: "Internal server error" + error.message,
            message: status_codes_1.default[500],
        });
    }
});
exports.admin_signup = admin_signup;
