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
/**Associations */
user_1.default.hasMany(request_1.default, { foreignKey: 'user_id' });
request_1.default.belongsTo(user_1.default, {
    constraints: true,
    onDelete: "NULL",
    onUpdate: "CASCADE",
    foreignKey: "user_id",
    targetKey: "user_id",
});
requestor_1.default.hasMany(request_1.default, { foreignKey: 'user_id' });
request_1.default.belongsTo(requestor_1.default, {
    constraints: true,
    onDelete: "NULL",
    onUpdate: "CASCADE",
    foreignKey: "requestor_id",
    targetKey: "user_id",
});
request_1.default.hasMany(notes_1.default);
notes_1.default.belongsTo(request_1.default, {
    constraints: true,
    onDelete: "NULL",
    onUpdate: "CASCADE",
    foreignKey: "requestId",
    targetKey: "request_id",
});
request_1.default.hasMany(order_1.default);
order_1.default.belongsTo(request_1.default, {
    constraints: true,
    onDelete: "NULL",
    onUpdate: "CASCADE",
    foreignKey: "requestId",
    targetKey: "request_id",
});
