import {
  Table,
  Column,
  DataType,
  Model,
  BelongsToMany,
  BelongsTo,
  HasOne
} from "sequelize-typescript";
import { RoleAttributes, RoleCreationAttributes } from "../../interfaces/role";
import Access from "./access";
import RoleAccessMapping from "./role-access_mapping";
@Table({ timestamps: true, tableName: "role" })
export default class Role extends Model<
  RoleAttributes,
  RoleCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  })
  role_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role_name: string;

  @Column({
    type: DataType.ENUM("all","admin","physician","patient"),
    allowNull: false,
  })
  account_type: string;

  @BelongsToMany(() => Access, {
    through: () => RoleAccessMapping,
    foreignKey: "role_id",
    otherKey: "access_id",
  })
  Access: Access[];
  // Omitted createdAt and updatedAt for brevity (already defined by timestamps: true)
}
