import { any } from "joi";
import { Optional } from "sequelize";

export interface LogsAttributes {
  log_id: number;
  type_of_log: string;
  recipient: string | null;
  action: string;
  role_name: string;
  email: string;
  mobile_no: bigint;
  sent: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface LogsCreationAttributes
  extends Optional<
    LogsAttributes,
    | "sent"
    | "mobile_no"
    | "email"
    | "role_name"
    | "action"
    | "recipient"
    | "createdAt"
    | "updatedAt"
    | "log_id"
  > {}
