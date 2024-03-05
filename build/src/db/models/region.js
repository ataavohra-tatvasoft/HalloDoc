"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../connections/database"));
class Region extends sequelize_1.Model {
}
Region.init({
    region_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    region_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, { timestamps: false,
    sequelize: database_1.default,
    tableName: "region",
});
exports.default = Region;
