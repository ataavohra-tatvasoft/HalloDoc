import { DataTypes, Model } from "sequelize";
import sequelize from "../../../connections/database";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
class Documents extends Model<
  InferAttributes<Documents>,
  InferCreationAttributes<Documents>
> {
  declare request_id: number;
  declare document_id: CreationOptional<number>;
  declare document_path: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Documents.init(
  {
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    document_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    document_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      onUpdate: "CASCADE",
    },
  },
  { timestamps: true, sequelize, tableName: "documents" }
);

export default Documents;
