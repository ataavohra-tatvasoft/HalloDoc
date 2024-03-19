import { any } from "joi";
import { Optional } from "sequelize";

export interface BusinessAttributes {
  business_id: number;
  business_name: string;
  business_website: string | null;
  profession: string | null;
  fax_number: number | null;
  mobile_no: number | null;
  email: string | null;
  business_contact: number | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: number | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface BusinessCreationAttributes
  extends Optional<
    BusinessAttributes,
    | "createdAt"
    | "updatedAt"
    | "business_website"
    | "profession"
    | "fax_number"
    | "mobile_no"
    | "email"
    | "business_contact"
    | "street"
    | "city"
    | "state"
    | "zip"
  > {}
