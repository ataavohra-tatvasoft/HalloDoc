import User from "./user";
import Request from "./request";
import Requestor from "./requestor";
import Notes from "./notes";
import Order from "./order";
import Documents from "./documents";

/** Associations */

// Each request belongs to one provider
Request.belongsTo(User, {
  as: 'Provider',
  foreignKey: "provider_id",
  targetKey: "user_id",
});

// Each request belongs to one physician
Request.belongsTo(User, {
  as: 'Physician',
  foreignKey: "physician_id",
  targetKey: "user_id",
});

// Each request belongs to one patient
Request.belongsTo(User, {
  as: 'Patient',
  foreignKey: "patient_id",
  targetKey: "user_id",
});

// Each request belongs to one requestor
Request.belongsTo(Requestor, {
  foreignKey: "requestor_id",
  targetKey: "user_id",
});

// Each request has many notes
Request.hasMany(Notes, { foreignKey: "requestId" });

// Each note belongs to one request
Notes.belongsTo(Request, { foreignKey: "requestId" });

// Each request has one order
Request.hasOne(Order, { foreignKey: "requestId" });

// Each order belongs to one request
Order.belongsTo(Request, { foreignKey: "requestId" });

// Each request has many documents
Request.hasMany(Documents, { foreignKey: "request_id" });

// Each document belongs to one request
Documents.belongsTo(Request, { foreignKey: "request_id" });
