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
  sent_tries: number;
  confirmation_no: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface LogsCreationAttributes
  extends Optional<
    LogsAttributes,
    | "sent_tries"
    | "confirmation_no"
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
