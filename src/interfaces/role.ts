import { Optional } from "sequelize";
export interface RoleAttributes {
  role_id: number;
  role_name: string;
  account_type: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface RoleCreationAttributes
  extends Optional<
    RoleAttributes,
    "role_id" | "role_name" | "account_type" | "createdAt" | "updatedAt"
  > {}
