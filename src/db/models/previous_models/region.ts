import { DataTypes, Model } from "sequelize";
import sequelize from "../../../connections/database";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
class Region extends Model<
  InferAttributes<Region>,
  InferCreationAttributes<Region>
> {
  declare region_id: number;
  declare region_name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Region.init(
  {
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    region_name: {
      type: DataTypes.STRING,
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
  { timestamps: true, sequelize, tableName: "region" }
);

export default Region;
