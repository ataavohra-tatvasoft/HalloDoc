import { Table, Column, DataType, Model } from "sequelize-typescript";
import {
  RegionAttributes,
  RegionCreationAttributes,
} from "../../interfaces/region_model";
@Table({ timestamps: true, tableName: "region" })
export default  class Region extends Model<RegionAttributes, RegionCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  region_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  region_name: string;

  // Omitted createdAt and updatedAt for brevity (already defined by timestamps: true)
}