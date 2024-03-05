import { DataTypes, Model } from "sequelize";
import sequelize from "../../connections/database";

class Documents extends Model {
  declare request_id: number;
  declare document_id: number;
  declare document_path: string;
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
      autoIncrement:true
    },

    document_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    upload_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false, sequelize, tableName: "documents" }
);

export default Documents;
