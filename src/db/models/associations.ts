import User from "./previous_models/user";
import Request from "./previous_models/request";
import Requestor from "./previous_models/requestor";
import Notes from "./previous_models/notes";
import Order from "./previous_models/order";
import Documents from "./previous_models/documents";
/**Associations */

// User.hasMany(Request,{ foreignKey : 'user_id'});
Request.belongsTo(User, {
  as: 'Provider',
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: "provider_id",
  targetKey: "user_id",
});

// User.hasMany(Request,{ foreignKey : 'user_id'});
Request.belongsTo(User, {
  as: 'Physician',
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: "physician_id",
  targetKey: "user_id",
});

Request.belongsTo(User, {
  as: 'Patient',
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

Request.hasMany(Notes, { foreignKey: "requestId" });
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

Request.hasMany(Documents, { foreignKey: "request_id" });
Documents.belongsTo(Request, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: "request_id",
  targetKey: "request_id",
});
