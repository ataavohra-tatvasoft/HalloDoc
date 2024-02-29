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
exports.create_request = void 0;
const request_1 = __importDefault(require("../../db/models/request"));
const status_codes_1 = __importDefault(require("../../public/status_codes"));
const notes_1 = __importDefault(require("../../db/models/notes"));
const patient_1 = __importDefault(require("../../db/models/patient"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config({ path: `.env` });
const create_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body: { FirstName, LastName, DOB, PhoneNumber, Email, AdminNotes, }, } = req;
        // const today = new Date();
        // console.log(today,today.getFullYear(),today.getFullYear().toString(),today.getFullYear().toString().slice(-2));
        const patient_data = yield patient_1.default.create({
            firstname: FirstName,
            lastname: LastName,
            dob: new Date(DOB),
            mobile_number: PhoneNumber,
            email: Email,
        });
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2); // Last 2 digits of year
        const month = String(today.getMonth() + 1).padStart(2, "0"); // 0-padded month
        const day = String(today.getDate()).padStart(2, "0"); // 0-padded day
        const todaysRequestsCount = yield request_1.default.count({
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: `${today.toISOString().split("T")[0]}`, // Since midnight today
                    [sequelize_1.Op.lt]: `${today.toISOString().split("T")[0]}T23:59:59.999Z`, // Until the end of today
                },
            },
        });
        const confirmation_no = `${patient_data.region.slice(0, 2)}${year}${month}${day}${LastName.slice(0, 2)}${FirstName.slice(0, 2)}${String(todaysRequestsCount + 1).padStart(4, "0")}`;
        const request_data = yield request_1.default.create({
            request_state: "new",
            patient_id: patient_data.patient_id,
            requested_by: "Admin",
            requested_date: new Date(),
            confirmation_no: confirmation_no,
        });
        const admin_note = yield notes_1.default.create({
            requestId: request_data.request_id,
            //  requested_by: "Admin",
            description: AdminNotes,
            typeOfNote: "admin",
        });
        if (!patient_data && !request_data && !admin_note) {
            return res.status(400).json({
                status: false,
                message: "Failed To Create Request!!!",
            });
        }
        if (patient_data && request_data && admin_note) {
            return res.status(200).json({
                status: true,
                message: "Created Request Successfully !!!",
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
exports.create_request = create_request;
