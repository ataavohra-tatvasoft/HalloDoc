import { Table, Column, DataType, Model,BelongsTo, Sequelize } from "sequelize-typescript";
import {
  OrderAttributes,
  OrderCreationAttributes,
} from "../../interfaces/order_model";
import Request from "./request_2";
import User from "./user_2";
import sequelize from "../../connections/database";

@Table({ timestamps: true , tableName: "order" })
export default class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey:true
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
  user_id: number;

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

  @BelongsTo(() => Request, {
    foreignKey: "request_id",
    targetKey: "request_id",
  })
  Request: Request;
  
  @BelongsTo(() => User, {
    foreignKey: "user_id",
    targetKey: "user_id",
  })
  Vendor: User;
  // Omitted createdAt and updatedAt for brevity (already defined by timestamps: true)
}
