"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patient_1 = __importDefault(require("./patient"));
const request_1 = __importDefault(require("./request"));
const concierge_1 = __importDefault(require("./concierge"));
const admin_1 = __importDefault(require("./admin"));
/**Associations */
admin_1.default.hasMany(request_1.default);
request_1.default.belongsTo(admin_1.default, {
    constraints: true,
    onDelete: "NULL",
    onUpdate: "CASCADE",
});
patient_1.default.hasMany(request_1.default);
request_1.default.belongsTo(patient_1.default, {
    constraints: true,
    onDelete: "NULL",
    onUpdate: "CASCADE",
});
concierge_1.default.hasMany(request_1.default);
request_1.default.belongsTo(concierge_1.default, {
    constraints: true,
    onDelete: "NULL",
    onUpdate: "CASCADE",
});
