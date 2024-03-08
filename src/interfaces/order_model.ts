import { any } from "joi";
import { Optional } from "sequelize";

export interface OrderAttributes {
  orderId: number;
  requestId: number;
  request_state: string;
  profession: string;
  businessName: string;
  businessContact: number;
  email: string;
  faxNumber: number;
  orderDetails: string;
  numberOfRefill: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface OrderCreationAttributes
  extends Optional<OrderAttributes, "createdAt" | "updatedAt" | "orderId"> {}
