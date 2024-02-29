"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { Sequelize } from "sequelize";
require("./src/db/models/associations");
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./src/routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(routes_1.default);
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
