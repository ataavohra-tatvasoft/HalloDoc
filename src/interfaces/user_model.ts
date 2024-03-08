import { Optional } from "sequelize";
export interface UserAttributes {
  user_id: number;
  email: string;
  password?: string; // Optional
  type_of_user: "admin" | "patient" | "provider";

  // Common fields for all user types
  firstname: string;
  lastname: string;
  mobile_no: string;
  address_1: string;
  address_2?: string | null;
  city: string;
  state: string;
  country_code?: string | null;
  zip: number;
  reset_token?: string | null;
  reset_token_expiry?: number;

  // Admin-specific fields (optional)
  billing_mobile_no?: number | null;
  status?: string | null;
  role?: string | null; // Removed redundant "admin" role field

  // Patient-specific fields (optional)
  dob?: Date | null;

  // Provider-specific fields (optional)
  medical_licence?: string | null;
  NPI_no?: number | null;
  alternative_mobile_no?: string | null;

  //Common attributes between Patient and Provider (optional)
  business_name?: string | null;
  street?: string | null;

  // Additional attributes (optional)
  tax_id?: string | null;
  profile_picture?: string | null;
  business_website?: string | null;
  on_call_status?: string | null;
  scheduled_status?: string | null;
  support_message?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "user_id"
    | "password"
    | "address_2"
    | "country_code"
    | "reset_token"
    | "reset_token_expiry"
    | "billing_mobile_no"
    | "status"
    | "role"
    | "dob"
    | "medical_licence"
    | "NPI_no"
    | "alternative_mobile_no"
    | "street"
    | "business_name"
    | "tax_id"
    | "profile_picture"
    | "business_website"
    | "on_call_status"
    | "scheduled_status"
    | "support_message"
    | "createdAt"
    | "updatedAt"
  > {}
