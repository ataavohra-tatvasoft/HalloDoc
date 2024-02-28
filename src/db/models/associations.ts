import Patient from "./patient";
import Request from "./request";
import Concierge from "./requestor";
import Admin from "./admin";

/**Associations */

Admin.hasMany(Request);
Request.belongsTo(Admin, {
  constraints: true,
  onDelete: "NULL",
  onUpdate: "CASCADE",
});

Patient.hasMany(Request);
Request.belongsTo(Patient, {
  constraints: true,
  onDelete: "NULL",
  onUpdate: "CASCADE",
});

Concierge.hasMany(Request);
Request.belongsTo(Concierge, {
  constraints: true,
  onDelete: "NULL",
  onUpdate: "CASCADE",
});


