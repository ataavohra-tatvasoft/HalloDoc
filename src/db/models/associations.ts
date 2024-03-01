import User from "./user";
import Request from "./request";
import Requestor from "./requestor";
import Notes from "./notes";
import Order from "./order";
/**Associations */

User.hasMany(Request,{ foreignKey : 'user_id'});
Request.belongsTo(User, {
  constraints: true,
  onDelete: "NULL",
  onUpdate: "CASCADE",
  foreignKey: "user_id",
  targetKey: "user_id",
});

Requestor.hasMany(Request, { foreignKey : 'user_id'});
Request.belongsTo(Requestor, {
  constraints: true,
  onDelete: "NULL",
  onUpdate: "CASCADE",
  foreignKey: "requestor_id",
  targetKey: "user_id",
});

Request.hasMany(Notes);
Notes.belongsTo(Request, {
  constraints: true,
  onDelete: "NULL",
  onUpdate: "CASCADE",
  foreignKey: "requestId",
  targetKey: "request_id",
});

Request.hasMany(Order);
Order.belongsTo(Request, {
  constraints: true,
  onDelete: "NULL",
  onUpdate: "CASCADE",
  foreignKey: "requestId",
  targetKey: "request_id",
});
