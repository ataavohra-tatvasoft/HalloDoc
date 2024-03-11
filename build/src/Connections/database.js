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
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const user_2_1 = __importDefault(require("../db/models/user_2"));
const request_2_1 = __importDefault(require("../db/models/request_2"));
const requestor_2_1 = __importDefault(require("../db/models/requestor_2"));
const notes_2_1 = __importDefault(require("../db/models/notes_2"));
const order_2_1 = __importDefault(require("../db/models/order_2"));
const documents_2_1 = __importDefault(require("../db/models/documents_2"));
const profession_2_1 = __importDefault(require("../db/models/profession_2"));
const region_2_1 = __importDefault(require("../db/models/region_2"));
dotenv_1.default.config({ path: "config.env" });
// const sequelize = new Sequelize(
//   "hallodoc_ngrok",
//   process.env.DB_USER as string,
//   process.env.DB_PASS,
//   {
//     dialect: "mysql",
//     host: "localhost",
//     define: {
//       freezeTableName: true,
//     },
//   }
// );
const sequelize = new sequelize_typescript_1.Sequelize({
<<<<<<< HEAD
    database: "hallodoc",
=======
    database: "hallodoc_ngrok",
>>>>>>> 53d4e4bc9e13ec394ba24e3a31b15820bc188c36
    host: "localhost",
    dialect: "mysql",
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    storage: ":memory:",
    models: [
        user_2_1.default,
        request_2_1.default,
        requestor_2_1.default,
        notes_2_1.default,
        order_2_1.default,
        documents_2_1.default,
        profession_2_1.default,
        region_2_1.default,
    ],
});
sequelize.addModels([
    user_2_1.default,
    request_2_1.default,
    requestor_2_1.default,
    notes_2_1.default,
    order_2_1.default,
    documents_2_1.default,
    profession_2_1.default,
    region_2_1.default,
]);
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
