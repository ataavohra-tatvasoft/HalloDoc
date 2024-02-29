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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const sequelize = new sequelize_1.Sequelize("hallodoc", process.env.DB_USER, process.env.DB_PASS, {
    dialect: "mysql",
    host: "localhost",
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
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sequelize.authenticate();
            console.log("Database connection successful");
        }
        catch (error) {
            console.error("Error connecting to database:", error);
            process.exit(1); // Exit the process on failure
        }
    });
}
connectToDatabase();
exports.default = sequelize;
