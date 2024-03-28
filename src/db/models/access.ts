import {
  Table,
  Column,
  DataType,
  Model,
  BelongsTo,
} from "sequelize-typescript";
import {
  AccessAttributes,
  AccessCreationAttributes,
} from "../../interfaces/access";
import User from "./user";
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
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  /**Admin */

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  regions: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  scheduling: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  history: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  accounts: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  role: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  provider: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  request_data: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  vendorship: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  profession: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  email_logs: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  halo_administrators: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  halo_users: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  cancelled_history: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  provider_location: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  halo_employee: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  halo_work_place: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  patient_records: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  blocked_history: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  sms_logs: string;

  /**Physician */
  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  my_schedule: string;

  /**Common Admin and Physician */
  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  dashboard: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  my_profile: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  send_order: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  chat: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: null,
  })
  invoicing: string;

  @BelongsTo(() => User, {
    foreignKey: "user_id",
    targetKey: "user_id",
  })
  User: User;
  // Omitted createdAt and updatedAt for brevity (already defined by timestamps: true)
}
