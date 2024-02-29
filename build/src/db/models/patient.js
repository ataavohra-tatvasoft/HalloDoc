"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../connections/database"));
const sequelize_1 = require("sequelize");
class Patient extends sequelize_1.Model {
}
Patient.init({
    patient_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    dob: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    mobile_number: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        unique: true,
    },
    region: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    business_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    street: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    zip: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    reset_token: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    reset_token_expiry: { type: sequelize_1.DataTypes.BIGINT, allowNull: true },
}, { timestamps: false,
    sequelize: database_1.default,
    modelName: "Patient",
    tableName: "patient",
});
exports.default = Patient;
