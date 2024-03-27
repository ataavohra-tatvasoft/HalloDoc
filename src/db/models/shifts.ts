import { Table, Column, DataType, Model, BelongsTo } from "sequelize-typescript";
import {
  ShiftsAttributes,
  ShiftsCreationAttributes,
} from "../../interfaces/shifts_model";
import User from "./user";
@Table({ timestamps: true, tableName: "shifts" })
export default class Shifts extends Model<
  ShiftsAttributes,
  ShiftsCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  shift_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  region: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  physician: string;

  @Column({
    type: DataType.ENUM("approved", "pending"),
    allowNull: false,
    defaultValue: "pending"
  })
  status: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  shift_date: Date;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  start: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  end: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  repeat_end: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  repeat_days: string; 

  @BelongsTo(() => User, {
    foreignKey: "user_id",
    targetKey: "user_id",
  })
  User: User;

  // Omitted createdAt and updatedAt for brevity (already defined by timestamps: true)
}
