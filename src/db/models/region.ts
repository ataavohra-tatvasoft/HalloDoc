import {
  Table,
  Column,
  DataType,
  Model,
  BelongsToMany,
} from "sequelize-typescript";
import {
  RegionAttributes,
  RegionCreationAttributes,
} from "../../interfaces/region";
import User from "./user";
import UserRegionMapping from "./user-region_mapping";
@Table({ timestamps: true, tableName: "region" })
export default class Region extends Model<
  RegionAttributes,
  RegionCreationAttributes
> {
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

  @BelongsToMany(() => User, {
    through: () => UserRegionMapping,
    foreignKey: "region_id",
    otherKey: "user_id",
  })
  Users: User[];
  // Omitted createdAt and updatedAt for brevity (already defined by timestamps: true)
}
