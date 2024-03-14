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
  reset_token?: string | null;
  reset_token_expiry?: number;
  address_1: string;
  address_2?: string | null;
  city: string;
  state: string;
  country_code?: string | null;
  zip: number;
  role?: string | null;

  // Admin-specific fields (optional)
  billing_mobile_no?: number | null;
  status?: string | null;

  // Patient-specific fields (optional)
  dob?: Date | null;

  // Provider-specific fields (optional)
  medical_licence?: string | null;
  NPI_no?: number | null;
  alternative_mobile_no?: string | null;
  stop_notification_status?: string | null;

  // Vendors-specific fields
  profession?: string | null;
  business_contact?: number | null;
  fax_number?: number | null;

  //Common attributes between Patient and Provider (optional)
  street?: string | null;

  //Common attributes between Admin and Provider
  open_requests: number | null;

  // Common attributes between Patient and Provider and Vendor
  business_name: string | null;

  // Additional attributes (optional)
  tax_id?: string | null;
  profile_picture?: string | null;
  signature_photo: string | null;
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
    | "country_code"
    | "reset_token_expiry"
    | "reset_token"
    | "address_2"
    | "zip"
    | "role"
    | "billing_mobile_no"
    | "status"
    | "dob"
    | "medical_licence"
    | "NPI_no"
    | "alternative_mobile_no"
    | "stop_notification_status"
    | "profession"
    | "business_contact"
    | "fax_number"
    | "street"
    | "open_requests"
    | "business_name"
    | "tax_id"
    | "profile_picture"
    | "signature_photo"
    | "business_website"
    | "on_call_status"
    | "scheduled_status"
    | "support_message"
    | "createdAt"
    | "updatedAt"
  > {}
