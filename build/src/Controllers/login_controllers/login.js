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
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const status_codes_1 = __importDefault(require("../../public/status_codes"));
const user_1 = __importDefault(require("../../db/models/previous_models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var user_data;
        const { body: { email, password }, } = req;
        const user = yield user_1.default.findOne({
            attributes: [
                "user_id",
                "password",
                "firstname",
                "lastname",
                "email",
                "type_of_user"
            ],
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "USER " + status_codes_1.default[404],
            });
        }
        if (user) {
            const hashpassword = user.password;
            const user_boolean = yield bcrypt_1.default.compare(password, hashpassword);
            if (user_boolean) {
                user_data = yield user_1.default.findOne({
                    where: {
                        email,
                        password: hashpassword,
                    },
                    attributes: [
                        "user_id",
                        "firstname",
                        "lastname",
                        "email",
                        "type_of_user"
                    ]
                });
            }
            if (!user_data) {
                return res.status(401).json({
                    status: false,
                    message: status_codes_1.default[401],
                });
            }
        }
        const data = {
            user_id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            type_of_user: user.type_of_user,
        };
        const jwtToken = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET_KEY);
        return res.status(200).json({
            status: true,
            message: status_codes_1.default[200],
            jwtToken,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            errormessage: error.message,
            message: status_codes_1.default[500],
        });
    }
});
exports.login = login;
