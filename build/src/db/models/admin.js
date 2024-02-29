"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../connections/database"));
const sequelize_1 = require("sequelize");
class Admin extends sequelize_1.Model {
}
Admin.init({
    adminid: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    status: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    firstname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    lastname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    role: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    mobile_no: { type: sequelize_1.DataTypes.BIGINT, allowNull: false, unique: true },
    address_1: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    address_2: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    city: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    state: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    country_code: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    zip: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    billing_mobile_no: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    // reset_token: { type: DataTypes.UUIDV4, allowNull:true},
    reset_token: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    reset_token_expiry: { type: sequelize_1.DataTypes.BIGINT, allowNull: true },
}, {
    sequelize: database_1.default,
    tableName: "admin",
});
exports.default = Admin;
