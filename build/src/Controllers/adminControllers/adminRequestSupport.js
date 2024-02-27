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
exports.postRequestSupport = void 0;
const provider_1 = __importDefault(require("../../Models/provider"));
const postRequestSupport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { support_message } = req.body;
        const requests = yield provider_1.default.findAll({
            where: { scheduled_status: "no" },
        });
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
exports.postRequestSupport = postRequestSupport;
