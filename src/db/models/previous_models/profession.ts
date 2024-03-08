import { DataTypes, Model } from "sequelize";
import sequelize from "../../../connections/database";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
class Profession extends Model<
  InferAttributes<Profession>,
  InferCreationAttributes<Profession>
> {
  declare profession_id: number;
  declare profession_name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Profession.init(
  {
    profession_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    profession_name: {
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
  { timestamps: true, sequelize, tableName: "profession" }
);

export default Profession;
