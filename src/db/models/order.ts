import {
  Table,
  Column,
  DataType,
  Model,
  BelongsTo,
  Sequelize,
} from "sequelize-typescript";
import { OrderAttributes, OrderCreationAttributes } from "../../interfaces";
import { RequestModel } from "./request";
import { Business } from "./business-vendor";

@Table({ timestamps: true, tableName: "order" })
export class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  order_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  request_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  business_id: number;

  @Column({
    type: DataType.ENUM("active", "conclude", "toclose"),
    allowNull: false,
  })
  request_state: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  order_details: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  number_of_refill: number;

  @BelongsTo(() => RequestModel, {
    foreignKey: "request_id",
    targetKey: "request_id",
  })
  Request: RequestModel;

  @BelongsTo(() => Business, {
    foreignKey: "business_id",
    targetKey: "business_id",
  })
  Business: Business;
}
