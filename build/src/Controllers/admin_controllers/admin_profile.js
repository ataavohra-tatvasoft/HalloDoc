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
exports.admin_profile = void 0;
const request_1 = __importDefault(require("../../models/request"));
const admin_profile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { admin_ID } = req.params;
    try {
        const profile = yield request_1.default.findByPk(admin_ID);
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
