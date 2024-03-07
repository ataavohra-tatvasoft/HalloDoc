"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const request_1 = __importDefault(require("./request"));
const requestor_1 = __importDefault(require("./requestor"));
const notes_1 = __importDefault(require("./notes"));
const order_1 = __importDefault(require("./order"));
const documents_1 = __importDefault(require("./documents"));
/** Associations */
// Each request belongs to one provider
request_1.default.belongsTo(user_1.default, {
    as: 'Provider',
    foreignKey: "provider_id",
});
// Each request belongs to one physician
request_1.default.belongsTo(user_1.default, {
    as: 'Physician',
    foreignKey: "physician_id",
});
// Each request belongs to one patient
request_1.default.belongsTo(user_1.default, {
    as: 'Patient',
    foreignKey: "patient_id",
});
// Each request belongs to one requestor
request_1.default.belongsTo(requestor_1.default, {
    foreignKey: "requestor_id",
});
// Each request has many notes
request_1.default.hasMany(notes_1.default, { foreignKey: "requestId" });
// Each note belongs to one request
notes_1.default.belongsTo(request_1.default, { foreignKey: "requestId" });
// Each request has one order
request_1.default.hasOne(order_1.default, { foreignKey: "requestId" });
// Each order belongs to one request
order_1.default.belongsTo(request_1.default, { foreignKey: "requestId" });
// Each request has many documents
request_1.default.hasMany(documents_1.default, { foreignKey: "request_id" });
// Each document belongs to one request
documents_1.default.belongsTo(request_1.default, { foreignKey: "request_id" });
