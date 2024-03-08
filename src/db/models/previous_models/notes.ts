import { DataTypes, Model } from "sequelize";
import sequelize from "../../../connections/database";
import Request from "./request";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
class Notes extends Model<
  InferAttributes<Notes>,
  InferCreationAttributes<Notes>
> {
  declare requestId: number;
  declare noteId: CreationOptional<number>;
  declare physician_name: CreationOptional<string>;
  declare reason:CreationOptional <string>;
  declare description: string;
  declare typeOfNote: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
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
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      onUpdate: "CASCADE",
    },
  },
  { timestamps: true, sequelize, tableName: "notes" }
);

export default Notes;
