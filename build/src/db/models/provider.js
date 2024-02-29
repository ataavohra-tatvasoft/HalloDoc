"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../connections/database"));
const sequelize_1 = require("sequelize");
class Provider extends sequelize_1.Model {
}
Provider.init({
    provider_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    firstname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    lastname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    role: { type: sequelize_1.DataTypes.ENUM("physician"), allowNull: false },
    mobile_no: { type: sequelize_1.DataTypes.BIGINT, allowNull: false, unique: true },
    medical_licence: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    NPI_no: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    address_1: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    address_2: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    region: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    city: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    state: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    country_code: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    zip: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    alternative_mobile_no: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
        unique: true,
    },
    // reset_token: { type: DataTypes.UUIDV4, allowNull:true},
    business_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    business_website: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    on_call_status: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    reset_token: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    reset_token_expiry: { type: sequelize_1.DataTypes.BIGINT, allowNull: true },
    scheduled_status: { type: sequelize_1.DataTypes.ENUM("yes", "no"), defaultValue: "no" },
    support_message: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, { timestamps: false,
    sequelize: database_1.default,
    tableName: "provider",
    modelName: "Provider"
});
exports.default = Provider;
