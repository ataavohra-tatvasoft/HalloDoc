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
/**Associations */
// User.hasMany(Request,{ foreignKey : 'user_id'});
request_1.default.belongsTo(user_1.default, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    foreignKey: "provider_id",
    targetKey: "user_id",
});
// User.hasMany(Request,{ foreignKey : 'user_id'});
request_1.default.belongsTo(user_1.default, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    foreignKey: "physician_id",
    targetKey: "user_id",
});
request_1.default.belongsTo(user_1.default, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    foreignKey: "patient_id",
    targetKey: "user_id",
});
// Requestor.hasMany(Request, { foreignKey : 'user_id'});
request_1.default.belongsTo(requestor_1.default, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    foreignKey: "requestor_id",
    targetKey: "user_id",
});
request_1.default.hasMany(notes_1.default, { foreignKey: "requestId" });
notes_1.default.belongsTo(request_1.default, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    foreignKey: "requestId",
    targetKey: "request_id",
});
// Request.hasMany(Order);
order_1.default.belongsTo(request_1.default, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    foreignKey: "requestId",
    targetKey: "request_id",
});
request_1.default.hasMany(documents_1.default, { foreignKey: "request_id" });
documents_1.default.belongsTo(request_1.default, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    foreignKey: "request_id",
    targetKey: "request_id",
});
