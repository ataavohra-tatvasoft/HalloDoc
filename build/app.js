"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_1 = __importDefault(require("./src/Routes/index"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./src/Connections/database"));
dotenv_1.default.config({ path: ".env" });
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(index_1.default);
database_1.default
    .sync({ alter: true })
    .then(() => {
    console.log("Application Started!!!");
    app.listen(process.env.PORT);
})
    .catch((error) => {
    console.log(error);
    console.log("Error Occurred => ", error.message);
});
