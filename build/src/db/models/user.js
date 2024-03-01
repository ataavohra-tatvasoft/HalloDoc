"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../connections/database"));
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    ;
    ;
    ; // Removed redundant "admin" role field
}
User.init({
    user_id: {
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
    type_of_user: {
        type: sequelize_1.DataTypes.ENUM("admin", "patient", "provider"),
        allowNull: false,
    },
    // Common fields
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    mobile_no: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        unique: true,
    },
    reset_token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    reset_token_expiry: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    address_1: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    address_2: {
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
    country_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    zip: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    // Admin-specific fields
    billing_mobile_no: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        unique: true,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true // Removed redundant "admin" role field
    },
    // Patient-specific fields
    dob: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    region: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    // Provider-specific fields
    medical_licence: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    NPI_no: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    alternative_mobile_no: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
        unique: true,
    },
    //Common attributes between Patient and Provider
    business_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    street: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    // Additional attributes
    tax_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    profile_picture: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    // business_name: { type: DataTypes.STRING, allowNull: false },
    business_website: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    on_call_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    scheduled_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    support_message: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    sequelize: database_1.default,
    tableName: "user",
});
exports.default = User;
