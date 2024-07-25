import { Optional } from "sequelize";
export interface RequestorAttributes {
  user_id?: number;
  first_name?: string;
  last_name?: string;
  mobile_number?: bigint;
  email?: string;
  house_name?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface RequestorCreationAttributes
  extends Optional<
    RequestorAttributes,
    | "user_id"
    | "first_name"
    | "last_name"
    | "mobile_number"
    | "email"
    | "house_name"
    | "street"
    | "city"
    | "state"
    | "zip"
    | "createdAt"
    | "updatedAt"
  > {}
