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
exports.access_useraccess_edit_save = exports.access_useraccess_edit = exports.access_useraccess = exports.access_accountaccess_delete = exports.access_accountaccess_edit_save = exports.access_accountaccess_edit = exports.access_accountaccess = exports.assign_request = exports.assign_request_region_physician = exports.assign_request_regions = exports.send_agreement = exports.transfer_request = exports.transfer_request_region_physician = exports.transfer_request_regions = exports.send_orders_for_request = exports.save_view_notes_for_request = exports.view_notes_for_request = exports.close_case_for_request_edit = exports.close_case_for_request = exports.cancel_case_for_request = exports.block_case_for_request = exports.clear_case_for_request = exports.view_case_for_request = exports.admin_profile = exports.request_support = exports.requests_by_request_state = exports.create_request = exports.admin_signup = void 0;
const request_1 = __importDefault(require("../../db/models/request"));
const requestor_1 = __importDefault(require("../../db/models/requestor"));
const user_1 = __importDefault(require("../../db/models/user"));
const notes_1 = __importDefault(require("../../db/models/notes"));
const order_1 = __importDefault(require("../../db/models/order"));
const crypto = __importStar(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const status_codes_1 = __importDefault(require("../../public/status_codes"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `.env` });
/**                              Admin in Dashboard                                       */
/**Admin SignUp */
const admin_signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { Email, Confirm_Email, Password, Confirm_Password, Status, Role, FirstName, LastName, MobileNumber, Zip, Billing_MobileNumber, Address_1, Address_2, City, State, Country_Code, }, } = req;
    const hashedPassword = yield bcrypt_1.default.hash(Password, 10);
    try {
        const adminData = yield user_1.default.create({
            type_of_user: "admin",
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
            errormessage: "Internal server error  " + error.message,
            message: status_codes_1.default[500],
        });
    }
});
exports.admin_signup = admin_signup;
/**Admin Create Request */
const create_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body: { FirstName, LastName, DOB, PhoneNumber, Email, AdminNotes, Region, }, } = req;
        // const today = new Date();
        // console.log(today,today.getFullYear(),today.getFullYear().toString(),today.getFullYear().toString().slice(-2));
        const patient_data = yield user_1.default.create({
            type_of_user: "patient",
            firstname: FirstName,
            lastname: LastName,
            dob: new Date(DOB),
            mobile_no: PhoneNumber,
            email: Email,
            region: Region,
        });
        if (!patient_data) {
            return res.status(400).json({
                status: false,
                message: "Failed To Create Patient!!!",
            });
        }
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
            patient_id: patient_data.user_id,
            requested_by: "admin",
            requested_date: new Date(),
            confirmation_no: confirmation_no,
        });
        const admin_note = yield notes_1.default.create({
            requestId: request_data.request_id,
            //  requested_by: "Admin",
            description: AdminNotes,
            typeOfNote: "admin_notes",
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
            errormessage: "Internal server error " + error.message,
            message: status_codes_1.default[500],
        });
    }
});
exports.create_request = create_request;
/**Admin request by request_state and region */
const requests_by_request_state = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state } = req.params;
        const { firstname, lastname, region } = req.query; // Get search parameters from query string
        const whereClause = {};
        if (firstname) {
            whereClause.firstname = {
                [sequelize_1.Op.like]: `%${firstname}%`, // Use LIKE operator for partial matching
            };
        }
        if (lastname) {
            whereClause.lastname = {
                [sequelize_1.Op.like]: `%${lastname}%`,
            };
        }
        if (region) {
            whereClause.region = {
                [sequelize_1.Op.like]: `%${region}%`,
            };
            whereClause.type_of_user = "patient";
        }
        switch (state) {
            case "new": {
                {
                    const requests = yield request_1.default.findAll({
                        where: { request_state: state },
                        attributes: ["requested_date", "request_state", "patient_id"],
                        include: [
                            {
                                model: user_1.default,
                                attributes: [
                                    "user_id",
                                    "firstname",
                                    "lastname",
                                    "dob",
                                    "mobile_no",
                                    "address_1",
                                ],
                                // where: {
                                //   type_of_user: "patient",
                                // },
                                where: whereClause
                            },
                            {
                                model: requestor_1.default,
                                attributes: ["user_id", "first_name", "last_name"],
                            },
                        ],
                    });
                    res.json(requests);
                    break;
                }
            }
            case "pending": {
                {
                    const requests = yield request_1.default.findAll({
                        where: { request_state: state },
                        attributes: ["requested_date", "notes_symptoms", "date_of_service"],
                        include: [
                            {
                                model: user_1.default,
                                attributes: [
                                    "user_id",
                                    "firstname",
                                    "lastname",
                                    "dob",
                                    "mobile_no",
                                    "address_1",
                                ],
                                where: whereClause
                            },
                            {
                                model: requestor_1.default,
                                attributes: ["user_id", "first_name", "last_name"],
                            },
                            {
                                model: user_1.default,
                                where: { role: "physician", type_of_user: "provider" },
                                attributes: ["user_id", "firstname", "lastname"],
                            },
                        ],
                    });
                    if (requests) {
                        console.log("error");
                    }
                    res.json(requests);
                    break;
                }
            }
            case "active": {
                const requests = yield request_1.default.findAll({
                    where: { request_state: state },
                    attributes: ["requested_date", "notes_symptoms", "date_of_service"],
                    include: [
                        {
                            model: user_1.default,
                            attributes: [
                                "user_id",
                                "firstname",
                                "lastname",
                                "dob",
                                "mobile_no",
                                "address_1",
                            ],
                            where: whereClause
                        },
                        {
                            model: requestor_1.default,
                            attributes: ["user_id", "first_name", "last_name"],
                        },
                        {
                            model: user_1.default,
                            where: { role: "physician", type_of_user: "provider" },
                            attributes: ["user_id", "firstname", "lastname"],
                        },
                    ],
                });
                res.json(requests);
                break;
            }
            case "conslude": {
                const requests = yield request_1.default.findAll({
                    where: { request_state: state },
                    attributes: ["requested_date", "date_of_service"],
                    include: [
                        {
                            model: user_1.default,
                            attributes: [
                                "patient_id",
                                "firstname",
                                "lastname",
                                "dob",
                                "mobile_no",
                                "address_1",
                            ],
                            where: whereClause
                        },
                        {
                            model: user_1.default,
                            where: { role: "physician", type_of_user: "provider" },
                            attributes: ["user_id", "firstname", "lastname"],
                        },
                    ],
                });
                res.json(requests);
                break;
            }
            case "toclose": {
                const requests = yield request_1.default.findAll({
                    where: { request_state: state },
                    attributes: ["date_of_service", "notes_symptoms"],
                    include: [
                        {
                            model: user_1.default,
                            attributes: [
                                "user_id",
                                "firstname",
                                "lastname",
                                "dob",
                                "address_1",
                                "region",
                            ],
                            where: whereClause
                        },
                        {
                            model: user_1.default,
                            where: { role: "physician", type_of_user: "provider" },
                            attributes: ["user_id", "firstname", "lastname"],
                        },
                    ],
                });
                res.json(requests);
                break;
            }
            case "unpaid": {
                const requests = yield request_1.default.findAll({
                    where: { request_state: state },
                    attributes: ["date_of_service"],
                    include: [
                        {
                            model: user_1.default,
                            attributes: [
                                "user_id",
                                "firstname",
                                "lastname",
                                "mobile_no",
                                "address_1",
                            ],
                            where: whereClause
                        },
                        {
                            model: user_1.default,
                            where: { role: "physician", type_of_user: "provider" },
                            attributes: ["provider_id", "firstname", "lastname"],
                        },
                    ],
                });
                res.json(requests);
                break;
            }
            default: {
                res.status(500).json({ message: "Invalid State !!!" });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.requests_by_request_state = requests_by_request_state;
/**Admin Request Support */
const request_support = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { support_message } = req.body;
        yield user_1.default.update({
            support_message,
        }, {
            where: {
                scheduled_status: "no" || null,
                type_of_user: "provider",
            },
        });
        return res.status(200).json({
            status: true,
            message: "Successfull !!!",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.request_support = request_support;
/**Admin Profile */
const admin_profile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(" ")[1];
        const verifiedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const admin_id = verifiedToken.user_id;
        const profile = yield user_1.default.findOne({
            where: {
                user_id: admin_id,
            },
        });
        if (!profile) {
            return res.status(404).json({ error: "Request not found" });
        }
        res.json({ profile });
    }
    catch (error) {
        console.error("Error fetching Admin Profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.admin_profile = admin_profile;
/**Admin Request Actions */
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
                    model: user_1.default,
                    attributes: [
                        "firstname",
                        "lastname",
                        "dob",
                        "mobile_no",
                        "business_name",
                        "address_1",
                        "region",
                        "street",
                        "city",
                        "state",
                        "zip",
                    ],
                    where: {
                        type_of_user: "patient",
                    },
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
        try {
            if (state === "pending" || "toclose") {
                const request = yield request_1.default.findOne({
                    where: { confirmation_no },
                    attributes: ["confirmation_no"],
                });
                if (!request) {
                    return res.status(404).json({ error: "Request not found" });
                }
                yield notes_1.default.destroy({
                    where: {
                        requestId: request.request_id,
                    },
                });
                yield order_1.default.destroy({
                    where: {
                        requestId: request.request_id,
                    },
                });
                yield request_1.default.destroy({
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
        catch (_a) {
            res.status(404).json({ error: "Invalid State !!!" });
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
const close_case_for_request_edit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state } = req.params;
        const { firstname, lastname, dob, mobile_no, email } = req.body;
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
            const patient_data = yield user_1.default.findOne({
                where: { user_id: request.patient_id },
            });
            if (!patient_data) {
                return res.status(404).json({ error: "Patient not found" });
            }
            yield user_1.default.update({
                firstname,
                lastname,
                dob,
                mobile_no,
                email,
            }, {
                where: {
                    user_id: request.patient_id,
                    type_of_user: "patient",
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
const view_notes_for_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state, notes_for } = req.params;
        if (state === "new" ||
            "active" ||
            "pending" ||
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
            const list = yield notes_1.default.findAll({
                where: {
                    requestId: request.request_id,
                    typeOfNote: notes_for,
                },
                attributes: ["description"],
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
                request_state: state,
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
const transfer_request_regions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state } = req.params;
        if (state === "pending") {
            // Use distinct query to get unique regions
            const physicians = yield user_1.default.findAll({
                where: {
                    type_of_user: "provider",
                    role: "physician",
                },
                attributes: ["region", "firstname", "lastname"],
            });
            if (!physicians) {
                return res.status(200).json({
                    status: true,
                    message: "No physicians found.", // Include an empty regions array
                });
            }
            // Extract unique regions from physicians
            const uniqueRegions = Array.from(new Set(physicians.map((p) => p.region)));
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
                regions: uniqueRegions, // Include the unique regions array
            });
        }
    }
    catch (error) {
        console.error("Error in fetching Physicians:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.transfer_request_regions = transfer_request_regions;
const transfer_request_region_physician = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { region, state } = req.params;
        if (state === " pending") {
            const physicians = yield user_1.default.findAll({
                where: {
                    type_of_user: "provider",
                    region: region,
                    role: "physician",
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
exports.transfer_request_region_physician = transfer_request_region_physician;
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
        const { mobile_no, email } = req.body;
        const user = yield user_1.default.findOne({
            where: { email, mobile_no, type_of_user: "patient" },
        });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email address and mobile number",
                errormessage: status_codes_1.default[400],
            });
        }
        if (state === " pending") {
            const request = yield request_1.default.findOne({
                where: {
                    confirmation_no,
                    block_status: "no",
                    cancellation_status: "no",
                    close_case_status: "no",
                },
                include: {
                    model: user_1.default,
                    attributes: ["email", "mobile_number"],
                    where: {
                        type_of_user: "patient",
                    },
                },
            });
            if (!request) {
                return res.status(400).json({
                    message: "Invalid request case",
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
const assign_request_regions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state } = req.params;
        if (state === "new") {
            // Use distinct query to get unique regions
            const physicians = yield user_1.default.findAll({
                where: {
                    type_of_user: "provider",
                    role: "physician",
                },
                attributes: ["region", "firstname", "lastname"],
            });
            if (!physicians) {
                return res.status(200).json({
                    status: true,
                    message: "No physicians found.", // Include an empty regions array
                });
            }
            // Extract unique regions from physicians
            const uniqueRegions = Array.from(new Set(physicians.map((p) => p.region)));
            return res.status(200).json({
                status: true,
                message: "Successfull !!!",
                regions: uniqueRegions, // Include the unique regions array
            });
        }
    }
    catch (error) {
        console.error("Error in fetching Physicians:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.assign_request_regions = assign_request_regions;
const assign_request_region_physician = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { region, state } = req.params;
        if (state === "new") {
            const physicians = yield user_1.default.findAll({
                where: {
                    type_of_user: "provider",
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
exports.assign_request_region_physician = assign_request_region_physician;
const assign_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { confirmation_no, state } = req.params;
        const { firstname, lastname, assign_req_description } = req.body;
        if (state === "new") {
            const provider = yield user_1.default.findOne({
                where: {
                    type_of_user: "provider",
                    firstname,
                    lastname,
                    role: "physician",
                },
            });
            if (!provider) {
                return res.status(404).json({ error: "Provider not found" });
            }
            const physician_id = provider.user_id;
            yield request_1.default.update({
                provider_id: physician_id,
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
/**                             Admin in Access Roles                                     */
/** Admin Account Access */
const access_accountaccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield user_1.default.findAll({
            where: {
                status: "active",
            },
            attributes: ["firstname", "lastname", "type_of_user"],
        });
        if (!account) {
            return res.status(404).json({ error: "Accounts not found" });
        }
        res.status(200).json({ account });
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.access_accountaccess = access_accountaccess;
const access_accountaccess_edit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admin_id } = req.params;
        const account = yield user_1.default.findOne({
            where: {
                user_id: admin_id,
                status: "active",
            },
            attributes: [
                "firstname",
                "lastname",
                "mobile_no",
                "address_1",
                "address_2",
                "city",
                "state",
                "zip",
                "dob",
                "region",
                "type_of_user",
            ],
        });
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.status(200).json({ account });
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.access_accountaccess_edit = access_accountaccess_edit;
const access_accountaccess_edit_save = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admin_id } = req.params;
        const { firstname, lastname, mobile_no, address_1, address_2, city, state, zip, dob, region, } = req.body;
        const account = yield user_1.default.findOne({
            where: {
                user_id: admin_id,
                status: "active",
            },
        });
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }
        const account_data = yield user_1.default.update({
            firstname,
            lastname,
            mobile_no,
            address_1,
            address_2,
            city,
            state,
            zip,
            dob,
            region,
        }, {
            where: {
                user_id: admin_id,
            },
        });
        if (!account_data) {
            return res.status(404).json({ error: "Error while editing information" });
        }
        return res.status(200).json({
            status: true,
            message: "Edited Successfully !!!",
        });
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.access_accountaccess_edit_save = access_accountaccess_edit_save;
const access_accountaccess_delete = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admin_id } = req.params;
        const account = yield user_1.default.findOne({
            where: {
                user_id: admin_id,
                status: "active",
            },
        });
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }
        const delete_account = yield user_1.default.destroy({
            where: {
                user_id: admin_id,
            },
        });
        if (!delete_account) {
            return res.status(404).json({ error: "Error while deleting account" });
        }
        return res.status(200).json({
            status: true,
            message: "Deleted Successfully !!!",
        });
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.access_accountaccess_delete = access_accountaccess_delete;
/** Admin User Access */
const access_useraccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname } = req.query; // Get search parameters from query string
        const whereClause = {};
        if (firstname) {
            whereClause.firstname = {
                [sequelize_1.Op.like]: `%${firstname}%`, // Use LIKE operator for partial matching
            };
        }
        if (lastname) {
            whereClause.lastname = {
                [sequelize_1.Op.like]: `%${lastname}%`,
            };
        }
        const accounts = yield user_1.default.findAll({
            attributes: [
                "firstname",
                "lastname",
                "type_of_user",
                "mobile_no",
                "status",
            ],
            where: whereClause, // Apply constructed search criteria
        });
        if (!accounts) {
            return res.status(404).json({ error: "No matching users found" });
        }
        res.status(200).json({ accounts });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.access_useraccess = access_useraccess;
const access_useraccess_edit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admin_id } = req.params;
        const account = yield user_1.default.findOne({
            where: {
                user_id: admin_id,
            },
            attributes: [
                "firstname",
                "lastname",
                "mobile_no",
                "address_1",
                "address_2",
                "city",
                "state",
                "zip",
                "dob",
                "region",
                "type_of_user",
                "status",
            ],
        });
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.status(200).json({ account });
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.access_useraccess_edit = access_useraccess_edit;
const access_useraccess_edit_save = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admin_id } = req.params;
        const { firstname, lastname, mobile_no, address_1, address_2, city, state, zip, dob, region, type_of_user, } = req.body;
        const account = yield user_1.default.findOne({
            where: {
                user_id: admin_id,
            },
        });
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }
        const account_data = yield user_1.default.update({
            firstname,
            lastname,
            mobile_no,
            address_1,
            address_2,
            city,
            state,
            zip,
            dob,
            region,
            type_of_user,
        }, {
            where: {
                user_id: admin_id,
            },
        });
        if (!account_data) {
            return res.status(404).json({ error: "Error while editing information" });
        }
        return res.status(200).json({
            status: true,
            message: "Edited Successfully !!!",
        });
    }
    catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.access_useraccess_edit_save = access_useraccess_edit_save;
/**                             Admin in Provider Menu                                    */
