import User from "./user_2";
import Request from "./request_2";
import Requestor from "./requestor_2";
import Notes from "./notes_2";
import Order from "./order_2";
import Documents from "./documents_2";
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
