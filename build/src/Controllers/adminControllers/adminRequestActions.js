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
exports.putAssignRequest = exports.postSendAgreement = exports.postTransferRequest = exports.postSendOrdersForRequest = exports.getViewNotesForRequest = exports.putCloseCaseForRequest = exports.putCancelCaseForRequest = exports.putBlockCaseForRequest = exports.deleteClearCaseForRequest = exports.getViewCaseForRequest = void 0;
const request_1 = __importDefault(require("../../Models/request"));
const notes_1 = __importDefault(require("../../Models/notes"));
const order_1 = __importDefault(require("../../Models/order"));
const transfer_request_1 = __importDefault(require("../../Models/transfer_request"));
const statusCodes_1 = __importDefault(require("../../public/statusCodes"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto = __importStar(require("crypto"));
const getViewCaseForRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId } = req.params;
    try {
        const request = yield request_1.default.findByPk(requestId);
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
exports.getViewCaseForRequest = getViewCaseForRequest;
const deleteClearCaseForRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.deleteClearCaseForRequest = deleteClearCaseForRequest;
const putBlockCaseForRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.putBlockCaseForRequest = putBlockCaseForRequest;
const putCancelCaseForRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.putCancelCaseForRequest = putCancelCaseForRequest;
const putCloseCaseForRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.putCloseCaseForRequest = putCloseCaseForRequest;
const getViewNotesForRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getViewNotesForRequest = getViewNotesForRequest;
const postSendOrdersForRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.postSendOrdersForRequest = postSendOrdersForRequest;
const postTransferRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.postTransferRequest = postTransferRequest;
const postSendAgreement = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobile_number, email } = req.body;
        const user = yield request_1.default.findOne({
            where: { email, mobile_number },
        });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email address and mobile number",
                errormessage: statusCodes_1.default[400],
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
            errormessage: statusCodes_1.default[200],
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error sending Agreement",
            errormessage: statusCodes_1.default[500],
        });
    }
});
exports.postSendAgreement = postSendAgreement;
const putAssignRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId, state } = req.params;
    const { region, physician_name, assign_req_description, } = req.body;
    try {
        const request = yield request_1.default.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        yield request_1.default.update({
            physician_name,
            assign_req_description,
        }, {
            where: {
                request_id: requestId,
                region: region,
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
exports.putAssignRequest = putAssignRequest;
