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
exports.requestSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const statusCodes_1 = __importDefault(require("../public/statusCodes"));
const requestSchema = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { request_state, patient_id, firstname, lastname, dob, mobile_number, email, street, city, state, zip, requested_by, requestor_id, requestor_name, requested_date, address, notes_symptoms, region, physician_name, date_of_service, block_status, }, } = req;
    const schema = joi_1.default.object({
        request_state: joi_1.default.string().valid("new", "pending", "conclude", "unpaid", "active", "toclose").required(),
        patient_id: joi_1.default.number().integer().required(),
        firstname: joi_1.default.string().required(),
        lastname: joi_1.default.string().required(),
        dob: joi_1.default.date().required(),
        mobile_number: joi_1.default.string()
            .pattern(/^\d{10}$/)
            .required(),
        email: joi_1.default.string().email().required(),
        street: joi_1.default.string().required(),
        city: joi_1.default.string().required(),
        state: joi_1.default.string().required(),
        zip: joi_1.default.string()
            .pattern(/^\d{6}$/)
            .required(),
        requested_by: joi_1.default.string().valid("concierge", "family_friend", "business_partner").required(),
        requestor_id: joi_1.default.number().integer().required(),
        requestor_name: joi_1.default.string().required(),
        requested_date: joi_1.default.date().required(),
        address: joi_1.default.string().required(),
        notes_symptoms: joi_1.default.string().allow(null),
        region: joi_1.default.string().valid("ahmedabad", "anand", "nadiad").required(),
        physician_name: joi_1.default.string().required(),
        date_of_service: joi_1.default.date().required(),
        block_status: joi_1.default.string().valid("yes", "no").required(),
    });
    try {
        yield schema.validateAsync({ request_state,
            patient_id,
            firstname,
            lastname,
            dob,
            mobile_number,
            email,
            street,
            city,
            state,
            zip,
            requested_by,
            requestor_id,
            requestor_name,
            requested_date,
            address,
            notes_symptoms,
            region,
            physician_name,
            date_of_service,
            block_status, }, { abortEarly: false });
        next();
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            errormessage: error.message,
            message: statusCodes_1.default[500],
        });
    }
});
exports.requestSchema = requestSchema;
