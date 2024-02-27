"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../Connections/database"));
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
        type: sequelize_1.DataTypes.INTEGER,
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
        references: {
            model: 'Patient',
            key: "mobile_number",
        },
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Patient',
            key: "email",
        },
    },
    street: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    zip: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    requested_by: {
        type: sequelize_1.DataTypes.ENUM("family_friend", "concierge", "business_partner"),
        allowNull: false,
    },
    requestor_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Concierge',
            key: "user_id",
        },
    },
    requestor_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    requested_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    notes_symptoms: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    region: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    physician_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
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
        defaultValue: "no",
        allowNull: false,
    },
    agreement_status: {
        type: sequelize_1.DataTypes.ENUM("undefined", "pending", "accepted", "rejected"),
        defaultValue: "no",
        allowNull: false,
    },
    assign_req_description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    tableName: "request",
});
exports.default = Request;
