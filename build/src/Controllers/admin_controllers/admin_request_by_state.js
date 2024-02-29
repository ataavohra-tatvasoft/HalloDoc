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
exports.requests_by_state = void 0;
const request_1 = __importDefault(require("../../db/models/request"));
const patient_1 = __importDefault(require("../../db/models/patient"));
const requestor_1 = __importDefault(require("../../db/models/requestor"));
const provider_1 = __importDefault(require("../../db/models/provider"));
const requests_by_state = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state } = req.params;
        if (state == "new") {
            const requests = yield request_1.default.findAll({
                where: { request_state: state },
                attributes: ["requested_date"],
                include: [
                    {
                        model: patient_1.default,
                        attributes: [
                            "patient_id",
                            "firstname",
                            "lastname",
                            "dob",
                            "mobile_number",
                            "address",
                        ],
                    },
                    {
                        model: requestor_1.default,
                        attributes: ["user_id", "first_name", "last_name"],
                    },
                ],
            });
            res.json(requests);
        }
        if (state == "pending") {
            const requests = yield request_1.default.findAll({
                where: { request_state: state },
                attributes: ["requested_date", "notes_symptoms", "date_of_service"],
                include: [
                    {
                        model: patient_1.default,
                        attributes: [
                            "patient_id",
                            "firstname",
                            "lastname",
                            "dob",
                            "mobile_number",
                            "address",
                        ],
                    },
                    {
                        model: requestor_1.default,
                        attributes: ["user_id", "first_name", "last_name"],
                    },
                    {
                        model: provider_1.default,
                        where: { role: "physician" },
                        attributes: ["provider_id", "firstname", "lastname"],
                    },
                ],
            });
            res.json(requests);
        }
        if (state == "active") {
            const requests = yield request_1.default.findAll({
                where: { request_state: state },
                attributes: ["requested_date", "notes_symptoms", "date_of_service"],
                include: [
                    {
                        model: patient_1.default,
                        attributes: [
                            "patient_id",
                            "firstname",
                            "lastname",
                            "dob",
                            "mobile_number",
                            "address",
                        ],
                    },
                    {
                        model: requestor_1.default,
                        attributes: ["user_id", "first_name", "last_name"],
                    },
                    {
                        model: provider_1.default,
                        where: { role: "physician" },
                        attributes: ["provider_id", "firstname", "lastname"],
                    },
                ],
            });
            res.json(requests);
        }
        if (state == "conclude") {
            const requests = yield request_1.default.findAll({
                where: { request_state: state },
                attributes: ["requested_date", "date_of_service"],
                include: [
                    {
                        model: patient_1.default,
                        attributes: [
                            "patient_id",
                            "firstname",
                            "lastname",
                            "dob",
                            "mobile_number",
                            "address",
                        ],
                    },
                    {
                        model: provider_1.default,
                        where: { role: "physician" },
                        attributes: ["provider_id", "firstname", "lastname"],
                    },
                ],
            });
            res.json(requests);
        }
        if (state == "toclose") {
            const requests = yield request_1.default.findAll({
                where: { request_state: state },
                attributes: ["date_of_service", "notes_symptoms"],
                include: [
                    {
                        model: patient_1.default,
                        attributes: [
                            "patient_id",
                            "firstname",
                            "lastname",
                            "dob",
                            "address",
                            "region",
                        ],
                    },
                    {
                        model: provider_1.default,
                        where: { role: "physician" },
                        attributes: ["provider_id", "firstname", "lastname"],
                    },
                ],
            });
            res.json(requests);
        }
        if (state == "unpaid") {
            const requests = yield request_1.default.findAll({
                where: { request_state: state },
                attributes: ["date_of_service"],
                include: [
                    {
                        model: patient_1.default,
                        attributes: [
                            "patient_id",
                            "firstname",
                            "lastname",
                            "mobile_number",
                            "address",
                        ],
                    },
                    {
                        model: provider_1.default,
                        where: { role: "physician" },
                        attributes: ["provider_id", "firstname", "lastname"],
                    },
                ],
            });
            res.json(requests);
        }
        else {
            res.status(500).json({ message: "Invalid State !!!" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.requests_by_state = requests_by_state;
