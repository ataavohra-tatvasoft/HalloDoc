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
exports.requests_by_region = void 0;
const request_1 = __importDefault(require("../../models/request"));
const patient_1 = __importDefault(require("../../models/patient"));
const requests_by_region = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state, region } = req.params;
        const requests = yield request_1.default.findAll({
            where: { request_state: state },
            include: {
                model: patient_1.default,
                attributes: ["region"],
                where: {
                    region: region
                }
            },
        });
        res.json(requests);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.requests_by_region = requests_by_region;
