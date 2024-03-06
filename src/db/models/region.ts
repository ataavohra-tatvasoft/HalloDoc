import { DataTypes, Model } from "sequelize";
import sequelize from "../../connections/database";

class Region extends Model {
  declare region_id: number;
  declare region_name: string;
}

Region.init(
  {
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
    },

    region_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {  timestamps:true,
    sequelize,
    tableName: "region",
  }
);

export default Region;
