import {
  Table,
  Column,
  DataType,
  Model,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import {
  UserRegionMappingAttributes,
  UserRegionMappingCreationAttributes,
} from "../../interfaces/user-region_mapping";
import User from "./user";
import Region from "./region";
@Table({ timestamps: true, tableName: "user-region-mapping" })
export default class UserRegionMapping extends Model<
  UserRegionMappingAttributes,
  UserRegionMappingCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  id: number;

  // @ForeignKey(()=> User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;
 
  // @ForeignKey(()=> Region)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  region_id: number;

 
  // Omitted createdAt and updatedAt for brevity (already defined by timestamps: true)
}
