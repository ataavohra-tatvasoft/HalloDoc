import { any } from "joi";
import { Optional } from "sequelize";

export interface OrderAttributes {
  orderId: number;
  requestId: number;
  userId: number,
  request_state: string;
  orderDetails: string;
  numberOfRefill: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface OrderCreationAttributes
  extends Optional<OrderAttributes, "createdAt" | "updatedAt" | "orderId"> {}
