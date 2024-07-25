import { Optional } from "sequelize";
export interface AccessAttributes {
  access_id: number;
  access_name: string;
  account_type: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface AccessCreationAttributes
  extends Optional<
    AccessAttributes,
    "access_id" | "access_name" | "account_type" | "createdAt" | "updatedAt"
  > {}
