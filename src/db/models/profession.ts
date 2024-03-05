import { DataTypes, Model } from "sequelize";
import sequelize from "../../connections/database";

class Profession extends Model {
  declare profession_id: number;
  declare profession_name: string;
}

Profession.init(
  {
    profession_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
    },

    profession_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {  timestamps:false,
    sequelize,
    tableName: "profession",
  }
);

export default Profession;
