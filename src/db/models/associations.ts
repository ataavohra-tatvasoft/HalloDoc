import User from "./user";
import Request from "./request";
import Requestor from "./requestor";
import Notes from "./notes";
import Order from "./order";
import Documents from "./documents";
/**Associations */

// User.hasMany(Request,{ foreignKey : 'user_id'});
Request.belongsTo(User, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: "provider_id",
  targetKey: "user_id",
});
// User.hasMany(Request,{ foreignKey : 'user_id'});
Request.belongsTo(User, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: "patient_id",
  targetKey: "user_id",
});

// Requestor.hasMany(Request, { foreignKey : 'user_id'});
Request.belongsTo(Requestor, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: "requestor_id",
  targetKey: "user_id",
});

Request.hasMany(Notes,  { foreignKey : 'requestId'});
Notes.belongsTo(Request, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: "requestId",
  targetKey: "request_id",
});

// Request.hasMany(Order);
Order.belongsTo(Request, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: "requestId",
  targetKey: "request_id",
});

Request.hasMany(Documents,  { foreignKey : 'request_id'});
Documents.belongsTo(Request, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: "request_id",
  targetKey: "request_id",
});