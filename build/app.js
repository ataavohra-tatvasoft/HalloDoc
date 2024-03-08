"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// import { Sequelize } from "sequelize";
// import "./src/db/models/associations_2";
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./src/routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config({ path: "config.env" });
/** Constants */
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(routes_1.default);
app.use((0, multer_1.default)({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Application Started!!!");
//     app.listen(process.env.PORT);
//   })
//   .catch((error: Error) => {
//     console.log(error);
//     console.log("Error Occurred => ", error.message);
//   });
app.listen(process.env.PORT);
console.log("Application Started!!!");
