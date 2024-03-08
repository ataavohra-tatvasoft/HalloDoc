"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_2_1 = __importDefault(require("./user_2"));
const request_2_1 = __importDefault(require("./request_2"));
const requestor_2_1 = __importDefault(require("./requestor_2"));
const notes_2_1 = __importDefault(require("./notes_2"));
const order_2_1 = __importDefault(require("./order_2"));
const documents_2_1 = __importDefault(require("./documents_2"));
/** Associations */
// Each request belongs to one provider
request_2_1.default.belongsTo(user_2_1.default, {
    as: 'Provider',
    foreignKey: "provider_id",
    targetKey: "user_id",
});
// Each request belongs to one physician
request_2_1.default.belongsTo(user_2_1.default, {
    as: 'Physician',
    foreignKey: "physician_id",
    targetKey: "user_id",
});
// Each request belongs to one patient
request_2_1.default.belongsTo(user_2_1.default, {
    as: 'Patient',
    foreignKey: "patient_id",
    targetKey: "user_id",
});
// Each request belongs to one requestor
request_2_1.default.belongsTo(requestor_2_1.default, {
    foreignKey: "requestor_id",
    targetKey: "user_id",
});
// Each request has many notes
request_2_1.default.hasMany(notes_2_1.default, { foreignKey: "requestId" });
// Each note belongs to one request
notes_2_1.default.belongsTo(request_2_1.default, { foreignKey: "requestId" });
// Each request has one order
request_2_1.default.hasOne(order_2_1.default, { foreignKey: "requestId" });
// Each order belongs to one request
order_2_1.default.belongsTo(request_2_1.default, { foreignKey: "requestId" });
// Each request has many documents
request_2_1.default.hasMany(documents_2_1.default, { foreignKey: "request_id" });
// Each document belongs to one request
documents_2_1.default.belongsTo(request_2_1.default, { foreignKey: "request_id" });
