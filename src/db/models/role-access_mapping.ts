import {
  Table,
  Column,
  DataType,
  Model,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import {
  RoleAccessMappingAttributes,
  RoleAccessMappingCreationAttributes,
} from "../../interfaces";
@Table({ timestamps: true, tableName: "role-access-mapping" })
export class RoleAccessMapping extends Model<
  RoleAccessMappingAttributes,
  RoleAccessMappingCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  access_id: number;
}
