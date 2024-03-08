"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../../connections/database"));
const sequelize_1 = require("sequelize");
class Request extends sequelize_1.Model {
}
Request.init({
    request_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    confirmation_no: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    request_state: {
        type: sequelize_1.DataTypes.ENUM("new", "active", "pending", "conclude", "toclose", "unpaid"),
        allowNull: false,
    },
    provider_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    physician_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    patient_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    requested_by: {
        type: sequelize_1.DataTypes.ENUM("family/friend", "concierge", "business", "vip", "admin", "patient", "provider"),
        allowNull: false,
    },
    requestor_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    requested_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    notes_symptoms: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    date_of_service: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    block_status: {
        type: sequelize_1.DataTypes.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: false,
    },
    block_status_reason: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    cancellation_status: {
        type: sequelize_1.DataTypes.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: false,
    },
    close_case_status: {
        type: sequelize_1.DataTypes.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: false,
    },
    transfer_request_status: {
        type: sequelize_1.DataTypes.ENUM("pending", "accepted", "rejected"),
        defaultValue: null,
        allowNull: true,
    },
    agreement_status: {
        type: sequelize_1.DataTypes.ENUM("pending", "accepted", "rejected"),
        defaultValue: null,
        allowNull: true,
    },
    assign_req_description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        onUpdate: "CASCADE",
    },
}, { timestamps: true, sequelize: database_1.default, tableName: "request" });
exports.default = Request;
