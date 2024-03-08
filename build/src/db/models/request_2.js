"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const documents_2_1 = __importDefault(require("./documents_2"));
const order_2_1 = __importDefault(require("./order_2"));
const notes_2_1 = __importDefault(require("./notes_2"));
const user_2_1 = __importDefault(require("./user_2"));
const requestor_2_1 = __importDefault(require("./requestor_2"));
let Request = class Request extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], Request.prototype, "request_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Request.prototype, "confirmation_no", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("new", "active", "pending", "conclude", "toclose", "unpaid"),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Request.prototype, "request_state", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Request.prototype, "provider_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Request.prototype, "physician_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Request.prototype, "patient_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("family/friend", "concierge", "business", "vip", "admin", "patient", "provider"),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Request.prototype, "requested_by", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Request.prototype, "requestor_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Request.prototype, "requested_date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Request.prototype, "notes_symptoms", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Request.prototype, "date_of_service", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: false,
    }),
    __metadata("design:type", String)
], Request.prototype, "block_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Request.prototype, "block_status_reason", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: false,
    }),
    __metadata("design:type", String)
], Request.prototype, "cancellation_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: false,
    }),
    __metadata("design:type", String)
], Request.prototype, "close_case_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("pending", "accepted", "rejected"),
        defaultValue: null,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Request.prototype, "transfer_request_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("pending", "accepted", "rejected"),
        defaultValue: null,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Request.prototype, "agreement_status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Request.prototype, "assign_req_description", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_2_1.default, {
        as: "Provider",
        foreignKey: "provider_id",
        targetKey: "user_id",
    }),
    __metadata("design:type", user_2_1.default)
], Request.prototype, "Provider", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_2_1.default, {
        as: "Physician",
        foreignKey: "physician_id",
        targetKey: "user_id",
    }),
    __metadata("design:type", user_2_1.default)
], Request.prototype, "Physician", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_2_1.default, {
        as: "Patient",
        foreignKey: "patient_id",
        targetKey: "user_id",
    }),
    __metadata("design:type", user_2_1.default)
], Request.prototype, "Patient", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => requestor_2_1.default, {
        foreignKey: "requestor_id",
        targetKey: "user_id",
    }),
    __metadata("design:type", requestor_2_1.default)
], Request.prototype, "Requestor", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => notes_2_1.default, { foreignKey: "requestId" }),
    __metadata("design:type", Array)
], Request.prototype, "Notes", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => order_2_1.default, { foreignKey: "requestId" }),
    __metadata("design:type", Array)
], Request.prototype, "Order", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => documents_2_1.default, { foreignKey: "request_id" }),
    __metadata("design:type", Array)
], Request.prototype, "Documents", void 0);
Request = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "request",
    })
], Request);
exports.default = Request;
