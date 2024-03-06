"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../connections/database"));
class Notes extends sequelize_1.Model {
}
Notes.init({
    requestId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Request",
            key: "request_id",
        },
    },
    noteId: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    physician_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    reason: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    typeOfNote: {
        type: sequelize_1.DataTypes.ENUM("transfer_notes", "admin_notes", "physician_notes", "patient_notes", "admin_cancellation_notes", "physician_cancellation_notes", "patient_cancellation_notes"),
        allowNull: false,
    },
}, { timestamps: true,
    sequelize: database_1.default,
    tableName: "notes",
});
exports.default = Notes;
