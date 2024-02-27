"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../Connections/database"));
const request_1 = __importDefault(require("./request"));
class Transfer_Request extends sequelize_1.Model {
}
Transfer_Request.init({
    transferRequestId: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    requestId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: request_1.default,
            key: 'request_id',
        },
    },
    physician_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: 'orders',
});
exports.default = Transfer_Request;
