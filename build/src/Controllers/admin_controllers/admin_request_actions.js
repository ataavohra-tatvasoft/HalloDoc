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
exports.assign_request = exports.assign_request_region = exports.send_agreement = exports.transfer_request = exports.send_orders_for_request = exports.view_notes_for_request = exports.close_case_for_request = exports.cancel_case_for_request = exports.block_case_for_request = exports.clear_case_for_request = exports.view_case_for_request = void 0;
const notes_1 = __importDefault(require("../../models/notes"));
const order_1 = __importDefault(require("../../models/order"));
const patient_1 = __importDefault(require("../../models/patient"));
const transfer_request_1 = __importDefault(require("../../models/transfer_request"));
const status_codes_1 = __importDefault(require("../../public/status_codes"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto = __importStar(require("crypto"));
const request_1 = __importDefault(require("../../models/request"));
const provider_1 = __importDefault(require("../../models/provider"));
const view_case_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId } = req.params;
    try {
        const request = yield request_1.default.findOne({
            where: {
                request_id: requestId,
            },
            include: {
                model: patient_1.default,
                attributes: [
                    "firstname",
                    "lastname",
                    "dob",
                    "mobile_number",
                    "region",
                    "business_name",
                    "street",
                    "city",
                    "state",
                    "zip",
                    "address",
                ],
            },
        });
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        res.json({ request });
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.view_case_for_request = view_case_for_request;
const clear_case_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { state, requestId } = req.params;
    try {
        const request = yield request_1.default.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        yield request_1.default.destroy({
            where: {
                request_state: state,
                request_id: requestId,
            },
        });
        return res.status(200).json({
            status: true,
            message: "Successfull !!!",
        });
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.clear_case_for_request = clear_case_for_request;
const block_case_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId, state } = req.params;
    try {
        const request = yield request_1.default.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        yield request_1.default.update({
            block_status: "yes",
        }, {
            where: {
                request_id: requestId,
                request_state: state,
            },
        });
        return res.status(200).json({
            status: true,
            message: "Successfull !!!",
        });
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.block_case_for_request = block_case_for_request;
const cancel_case_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId, state } = req.params;
    try {
        const request = yield request_1.default.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        yield request_1.default.update({
            cancellation_status: "yes",
        }, {
            where: {
                request_id: requestId,
                request_state: state,
            },
        });
        return res.status(200).json({
            status: true,
            message: "Successfull !!!",
        });
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.cancel_case_for_request = cancel_case_for_request;
const close_case_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId, state } = req.params;
    try {
        const request = yield request_1.default.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        yield request_1.default.update({
            close_case_status: "yes",
        }, {
            where: {
                request_id: requestId,
                request_state: state,
            },
        });
        return res.status(200).json({
            status: true,
            message: "Successfull !!!",
        });
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.close_case_for_request = close_case_for_request;
const view_notes_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId, state, notes_for } = req.params;
    try {
        const request = yield request_1.default.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        const list = yield notes_1.default.findAll({
            where: {
                typeOfNote: notes_for,
                request_id: requestId,
                request_state: state,
            },
        });
        return res.status(200).json({
            status: true,
            message: "Successfull !!!",
            list,
        });
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.view_notes_for_request = view_notes_for_request;
const send_orders_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId, state } = req.params;
    const { profession, businessName, businessContact, email, faxNumber, orderDetails, numberOfRefill, } = req.body;
    try {
        const request = yield request_1.default.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        yield order_1.default.create({
            requestId,
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
    catch (error) {
        console.error("Error in Sending Order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.send_orders_for_request = send_orders_for_request;
const transfer_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId, state } = req.params;
    const { physician_name, description } = req.body;
    try {
        const request = yield request_1.default.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        yield transfer_request_1.default.create({
            requestId,
            physician_name,
            description,
        });
        yield request_1.default.update({
            transfer_request_status: "pending",
        }, {
            where: {
                request_id: requestId,
                request_state: state,
            },
        });
        return res.status(200).json({
            status: true,
            message: "Successfull !!!",
        });
    }
    catch (error) {
        console.error("Error in Sending Order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.transfer_request = transfer_request;
const send_agreement = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId } = req.params;
        const { mobile_number, email } = req.body;
        const request = yield request_1.default.findByPk(requestId, {
            include: {
                model: patient_1.default,
                attributes: ["email", "mobile_number"],
            },
        });
        if (!request) {
            return res.status(400).json({
                message: "Invalid email address and mobile number",
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
        const resetToken = crypto.createHash("sha256").update(email).digest("hex");
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
        const { region } = req.params;
        const physicians = yield provider_1.default.findAll({
            where: {
                role: "physician",
                region: region,
            },
        });
        return res.status(200).json({
            status: true,
            message: "Successfull !!!",
            physicians,
        });
    }
    catch (error) {
        console.error("Error in fetching Physicians:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.assign_request_region = assign_request_region;
const assign_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId } = req.params;
        const { firstname, lastname, assign_req_description } = req.body;
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
                request_id: requestId,
            },
        });
        return res.status(200).json({
            status: true,
            message: "Successfull !!!",
        });
    }
    catch (error) {
        console.error("Error in Assigning Request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.assign_request = assign_request;
