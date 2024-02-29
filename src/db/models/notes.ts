import { DataTypes, Model } from "sequelize";
import sequelize from "../../connections/database";
import Request from "./request";

class Notes extends Model {
  declare requestId: number;
  declare noteId: number;
  declare physician_name: string;
  declare reason: string;
  declare description: string;
  declare typeOfNote: string;
}

Notes.init(
  {
    requestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Request",
        key: "request_id",
      },
    },
    noteId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    physician_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeOfNote: {
      type: DataTypes.ENUM(
        "transfer_notes",
        "admin_notes",
        "physician_notes",
        "patient_notes",
        "admin_cancellation_notes",
        "physician_cancellation_notes",
        "patient_cancellation_notes"
      ),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "notes",
  }
);

export default Notes;
