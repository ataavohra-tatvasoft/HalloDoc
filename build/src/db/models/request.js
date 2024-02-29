"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../connections/database"));
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
    patient_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Patient",
            key: "patient_id",
        },
        unique: false,
    },
    requested_by: {
        type: sequelize_1.DataTypes.ENUM("family_friend", "concierge", "business_partner"),
        allowNull: false,
    },
    requestor_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Requestor',
            key: "user_id",
        },
    },
    requested_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    notes_symptoms: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    physician_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Provider',
            key: "provider_id",
        },
    },
    date_of_service: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    block_status: {
        type: sequelize_1.DataTypes.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: false,
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
        type: sequelize_1.DataTypes.ENUM("undefined", "pending", "accepted", "rejected"),
        defaultValue: "undefined",
        allowNull: false,
    },
    agreement_status: {
        type: sequelize_1.DataTypes.ENUM("undefined", "pending", "accepted", "rejected"),
        defaultValue: "undefined",
        allowNull: false,
    },
    assign_req_description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.default,
    tableName: "request",
});
exports.default = Request;
