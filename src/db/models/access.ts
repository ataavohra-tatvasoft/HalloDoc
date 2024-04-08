import {
  Table,
  Column,
  DataType,
  Model,
  BelongsToMany,
} from "sequelize-typescript";
import {
  AccessAttributes,
  AccessCreationAttributes,
} from "../../interfaces/access";
import RoleAccessMapping from "./role-access_mapping";
import Role from "./role";

@Table({ timestamps: true, tableName: "access" })
export default class Access extends Model<
  AccessAttributes,
  AccessCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  access_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  access_name: string;

  @Column({
    type: DataType.ENUM("all","admin", "physician", "patient"),
    allowNull: false,
  })
  account_type: string;


  @BelongsToMany(() => Role, {
    through: () => RoleAccessMapping,
    foreignKey: "access_id",
    otherKey: "role_id",
  })
  Role: Role[];
  // Omitted createdAt and updatedAt for brevity (already defined by timestamps: true)
}
