"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.assign_request = exports.assign_request_region = exports.send_agreement = exports.transfer_request = exports.transfer_request_region = exports.send_orders_for_request = exports.save_view_notes_for_request = exports.view_notes_for_request = exports.close_case_for_request = exports.close_case_for_request_edit = exports.cancel_case_for_request = exports.block_case_for_request = exports.clear_case_for_request = exports.view_case_for_request = void 0;
const notes_1 = __importDefault(require("../../db/models/notes"));
const order_1 = __importDefault(require("../../db/models/order"));
const patient_1 = __importDefault(require("../../db/models/patient"));
const status_codes_1 = __importDefault(require("../../public/status_codes"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto = __importStar(require("crypto"));
const request_1 = __importDefault(require("../../db/models/request"));
const provider_1 = __importDefault(require("../../db/models/provider"));
// import brcypt from "bcrypt";
const view_case_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state } = req.params;
        if (state === "new" ||
            "active" ||
            " pending" ||
            "conclude" ||
            "toclose" ||
            "unpaid") {
            const request = yield request_1.default.findOne({
                where: {
                    confirmation_no: confirmation_no,
                    block_status: "no",
                    cancellation_status: "no",
                    close_case_status: "no",
                },
                attributes: [
                    "request_id",
                    "request_state",
                    "confirmation_no",
                    "notes_symptoms",
                ],
                include: {
                    model: patient_1.default,
                    attributes: [
                        "confirmation_no",
                        "firstname",
                        "lastname",
                        "dob",
                        "mobile_number",
                        "business_name",
                        "address",
                        "region",
                        "street",
                        "city",
                        "state",
                        "zip",
                    ],
                },
            });
            if (!request) {
                return res.status(404).json({ error: "Request not found" });
            }
            res.json({ request });
        }
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.view_case_for_request = view_case_for_request;
const clear_case_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state, confirmation_no } = req.params;
        if (state === "pending" || "toclose") {
            const request = yield request_1.default.findOne({
                where: { confirmation_no },
            });
            if (!request) {
                return res.status(404).json({ error: "Request not found" });
            }
            yield request_1.default.destroy({
                where: {
                    request_state: state,
                    confirmation_no: confirmation_no,
                },
            });
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
            });
        }
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.clear_case_for_request = clear_case_for_request;
const block_case_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state } = req.params;
        if (state === "new") {
            const request = yield request_1.default.findOne({
                where: {
                    confirmation_no: confirmation_no,
                    request_state: state,
                    block_status: "no",
                },
            });
            if (!request) {
                return res.status(404).json({ error: "Request not found" });
            }
            yield request_1.default.update({
                block_status: "yes",
            }, {
                where: {
                    confirmation_no: confirmation_no,
                    request_state: state,
                },
            });
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
            });
        }
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.block_case_for_request = block_case_for_request;
const cancel_case_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state } = req.params;
        const { reason, additional_notes } = req.body;
        if (state === "new") {
            const request = yield request_1.default.findOne({
                where: {
                    confirmation_no: confirmation_no,
                    request_state: state,
                    cancellation_status: "no",
                },
            });
            if (!request) {
                return res.status(404).json({ error: "Request not found" });
            }
            yield request_1.default.update({
                cancellation_status: "yes",
            }, {
                where: {
                    request_id: request.request_id,
                    request_state: state,
                },
            });
            const find_note = yield notes_1.default.findOne({
                where: {
                    requestId: request.request_id,
                    typeOfNote: "admin_cancellation_notes",
                },
            });
            if (find_note) {
                notes_1.default.update({
                    description: additional_notes,
                    reason: reason,
                }, {
                    where: {
                        requestId: request.request_id,
                        typeOfNote: "admin_cancellation_notes",
                    },
                });
            }
            else {
                notes_1.default.create({
                    requestId: request.request_id,
                    typeOfNote: "admin_cancellation_notes",
                    description: additional_notes,
                    reason: reason,
                });
            }
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
            });
        }
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.cancel_case_for_request = cancel_case_for_request;
const close_case_for_request_edit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state } = req.params;
        const { firstname, lastname, dob, mobile_number, email } = req.body;
        if (state === "toclose") {
            const request = yield request_1.default.findOne({
                where: {
                    confirmation_no: confirmation_no,
                    request_state: state,
                    close_case_status: "no",
                },
            });
            if (!request) {
                return res.status(404).json({ error: "Request not found" });
            }
            const patient_data = yield patient_1.default.findOne({
                where: { patient_id: request.patient_id },
            });
            if (!patient_data) {
                return res.status(404).json({ error: "Patient not found" });
            }
            yield patient_1.default.update({
                firstname,
                lastname,
                dob,
                mobile_number,
                email,
            }, {
                where: {
                    patient_id: request.patient_id,
                },
            });
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
            });
        }
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.close_case_for_request_edit = close_case_for_request_edit;
const close_case_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state } = req.params;
        if (state === "toclose") {
            const request = yield request_1.default.findOne({
                where: {
                    confirmation_no: confirmation_no,
                    request_state: state,
                    close_case_status: "no",
                },
            });
            if (!request) {
                return res.status(404).json({ error: "Request not found" });
            }
            yield request_1.default.update({
                close_case_status: "yes",
            }, {
                where: {
                    confirmation_no: confirmation_no,
                    request_state: state,
                },
            });
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
            });
        }
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.close_case_for_request = close_case_for_request;
const view_notes_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state, notes_for } = req.params;
        if (state === "new" ||
            "active" ||
            " pending" ||
            "conclude" ||
            "toclose" ||
            "unpaid") {
            const request = yield yield request_1.default.findOne({
                where: {
                    confirmation_no: confirmation_no,
                    request_state: state,
                    block_status: "no",
                },
            });
            if (!request) {
                return res.status(404).json({ error: "Request not found" });
            }
            const list = yield notes_1.default.findAll({
                where: {
                    request_id: request.request_id,
                    request_state: state,
                    typeOfNote: notes_for,
                },
                include: ["description"],
            });
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
                list,
            });
        }
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.view_notes_for_request = view_notes_for_request;
const save_view_notes_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state } = req.params;
        const { new_note } = req.body;
        if (state === "new" ||
            "active" ||
            " pending" ||
            "conclude" ||
            "toclose" ||
            "unpaid") {
            const request = yield request_1.default.findOne({
                where: {
                    confirmation_no: confirmation_no,
                    request_state: state,
                    block_status: "no",
                },
            });
            if (!request) {
                return res.status(404).json({ error: "Request not found" });
            }
            const list = yield notes_1.default.update({
                description: new_note,
            }, {
                where: {
                    request_id: request.request_id,
                    typeOfNote: "admin_notes",
                },
            });
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
                list,
            });
        }
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.save_view_notes_for_request = save_view_notes_for_request;
const send_orders_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state } = req.params;
        const { profession, businessName, businessContact, email, faxNumber, orderDetails, numberOfRefill, } = req.body;
        if (state === "active" || "conclude" || "toclose") {
            const request = yield request_1.default.findOne({
                where: {
                    confirmation_no: confirmation_no,
                    request_state: state,
                    block_status: "no",
                    cancellation_status: "no",
                },
            });
            if (!request) {
                return res.status(404).json({ error: "Request not found" });
            }
            yield order_1.default.create({
                requestId: request.request_id,
                profession,
                businessName,
                businessContact,
                email,
                faxNumber,
                orderDetails,
                numberOfRefill,
            });
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
            });
        }
    }
    catch (error) {
        console.error("Error in Sending Order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.send_orders_for_request = send_orders_for_request;
const transfer_request_region = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { region, state } = req.params;
        if (state === " pending") {
            const physicians = yield provider_1.default.findAll({
                where: {
                    role: "physician",
                    region: region,
                },
                include: ["region", " firstname", "lastname"],
            });
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
                physicians,
            });
        }
    }
    catch (error) {
        console.error("Error in fetching Physicians:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.transfer_request_region = transfer_request_region;
const transfer_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state } = req.params;
        const { physician_name, description } = req.body;
        if (state == "pending") {
            const request = yield request_1.default.findOne({
                where: {
                    confirmation_no,
                    block_status: "no",
                    cancellation_status: "no",
                    close_case_status: "no",
                },
            });
            if (!request) {
                return res.status(404).json({ error: "Request not found" });
            }
            yield notes_1.default.create({
                requestId: request.request_id,
                physician_name,
                description,
                typeOfNote: "transfer_notes",
            });
            yield request_1.default.update({
                transfer_request_status: "pending",
            }, {
                where: {
                    request_id: request.request_id,
                    request_state: state,
                },
            });
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
            });
        }
    }
    catch (error) {
        console.error("Error in Sending Order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.transfer_request = transfer_request;
const send_agreement = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state } = req.params;
        const { mobile_number, email } = req.body;
        if (state === " pending") {
            const request = yield request_1.default.findOne({
                where: {
                    confirmation_no,
                    block_status: "no",
                    cancellation_status: "no",
                    close_case_status: "no"
                },
                include: {
                    model: patient_1.default,
                    attributes: ["email", "mobile_number"],
                },
            });
            if (!request) {
                return res.status(400).json({
                    message: "Invalid request case",
                    errormessage: status_codes_1.default[400],
                });
            }
            const user = yield patient_1.default.findOne({
                where: { email, mobile_number },
            });
            if (!user) {
                return res.status(400).json({
                    message: "Invalid email address and mobile number",
                    errormessage: status_codes_1.default[400],
                });
            }
            // const resetToken = uuid();
            const resetToken = crypto
                .createHash("sha256")
                .update(email)
                .digest("hex");
            const resetUrl = `http://localhost:7000/admin/dashboard/requests/:state/:requestId/actions/updateagreement`;
            const mailContent = `
      <html>
      <form action = "${resetUrl}" method="POST"> 
      <p>Tell us that you accept the agreement or not:</p>
      <p>Your token is: ${resetToken}</p>
      <br>
      <br>
      <label for="ResetToken">Token:</label>
      <input type="text" id="ResetToken" name="ResetToken" required>
      <br>
      <br>
      <label for="agreement_status">Agreement_Status:</label>
      <select id="agreement_status">
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </select>
    <br>
    <br>
      <button type = "submit">Submit Response</button>
      </form>
      </html>
    `;
            const transporter = nodemailer_1.default.createTransport({
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT),
                secure: false,
                debug: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            const info = yield transporter.sendMail({
                from: "vohraatta@gmail.com",
                to: email,
                subject: "Agreement",
                html: mailContent,
            });
            res.status(200).json({
                message: "Agreement sent to your email",
                errormessage: status_codes_1.default[200],
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error sending Agreement",
            errormessage: status_codes_1.default[500],
        });
    }
});
exports.send_agreement = send_agreement;
const assign_request_region = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { region, state } = req.params;
        if (state === "new") {
            const physicians = yield provider_1.default.findAll({
                where: {
                    role: "physician",
                    region: region,
                },
                include: ["region", " firstname", "lastname"],
            });
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
                physicians,
            });
        }
    }
    catch (error) {
        console.error("Error in fetching Physicians:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.assign_request_region = assign_request_region;
const assign_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state } = req.params;
        const { firstname, lastname, assign_req_description } = req.body;
        if (state === "new") {
            const provider = yield provider_1.default.findOne({
                where: {
                    firstname,
                    lastname,
                    role: "physician",
                },
            });
            if (!provider) {
                return res.status(404).json({ error: "Provider not found" });
            }
            const physician_id = provider.provider_id;
            yield request_1.default.update({
                physician_id,
                assign_req_description,
            }, {
                where: {
                    confirmation_no: confirmation_no,
                },
            });
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
            });
        }
    }
    catch (error) {
        console.error("Error in Assigning Request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.assign_request = assign_request;
