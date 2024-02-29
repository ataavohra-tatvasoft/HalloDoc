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
exports.request_support = void 0;
// import RequestModel from "../../models/request";
const provider_1 = __importDefault(require("../../db/models/provider"));
const request_support = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { support_message } = req.body;
        yield provider_1.default.update({
            support_message
        }, {
            where: {
                scheduled_status: "no",
            }
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
