"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "config.env" });
const sequelize = new sequelize_1.Sequelize("hallodoc", process.env.DB_USER, process.env.DB_PASS, {
    dialect: "mysql",
    host: 'localhost',
    define: {
        freezeTableName: true,
    },
});
const connection = sequelize.authenticate();
/** Connection to Database */
connection
    .then(() => {
    console.log("Connected to database :-) ");
})
    .catch((error) => {
    console.log("Error Occurred =>", error);
});
exports.default = sequelize;
